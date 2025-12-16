import { VisitService } from './visit.service';
import { UpdateVisitDto } from './dto/update-visit.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  UseGuards,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import type { AuthRequest } from '@common/interface/request.interface';
import { Roles } from '@common/constants';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { paginationOption } from '@common/utils/paginationOption';
import type { CommonPaginationOptionType } from '@common/types';
import { AppLogger } from '@common/logger/app.logger';
import { UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { storage } from '@common/middleware/multer.config';
import { parseBulkFormData } from '@helper/bulkInsertHelper';
import { successResponse } from '@common/utils';

@UseGuards(JwtAuthGuard)
@Controller('visit')
export class VisitController {
  constructor(
    private readonly visitService: VisitService,
    private readonly logger: AppLogger,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async createVisit(
    @Body() body: CreateVisitDto,
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = file ? `/uploads/others/${file?.filename}` : undefined;
    const path = file ? file?.path : undefined;
    return await this.visitService.createVisit({
      ...body,
      ...req.user,
      filePath,
      path,
    });
  }

  @Get()
  async getAllVisit(
    @Req() req: AuthRequest,
    @Param() params: CommonPaginationOptionType,
  ) {
    const { id, role, org_id } = req.user;

    const typeRole = role as Roles;

    if (!typeRole || !id) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    if (!org_id) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    switch (typeRole) {
      case Roles.CAREGIVER:
        return await this.visitService.getAllVisits(id);
      case Roles.SUPERVISOR:
        return await this.visitService.getAllVisitsByOrganization(
          org_id,
          paginationOption(params),
        );
      case Roles.ADMIN:
        break;
      default:
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('bulk-create')
  @UseInterceptors(AnyFilesInterceptor({ storage: storage }))
  async bulkCreateVisit(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File[],
  ) {
    console.log({ file });
    const body = req.body;
    const combinedData = parseBulkFormData<CreateVisitDto>(body, file);

    return await this.visitService.createManyVisits(combinedData, req.user);
  }

  @Get('updated/:after')
  async findOne(@Req() req: AuthRequest, @Param('after') after: string) {
    const { id } = req.user;
    const unixSeconds = Number(after); // convert to number
    const utcTimestamp = new Date(unixSeconds * 1000).toISOString();
    if (!utcTimestamp) {
      throw new HttpException('Invalid timestamp', HttpStatus.BAD_REQUEST);
    }
    const modifiedVisits = await this.visitService.getModifiedVisits(
      id,
      utcTimestamp,
    );
    const deletedVisits = await this.visitService.getDeletedVisits(
      id,
      utcTimestamp,
    );

    if (!modifiedVisits && !deletedVisits) {
      throw new HttpException('Visit not found', HttpStatus.NOT_FOUND);
    }
    return successResponse(
      { modifiedVisits, deletedVisits },
      'Visit fetch successfully',
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitService.update(+id, updateVisitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitService.remove(+id);
  }
}
