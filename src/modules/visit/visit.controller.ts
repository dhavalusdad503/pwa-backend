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
} from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { Roles } from 'src/common/constants';
import { AuthTokenPayload } from '@/common/types';

export interface AuthRequest extends Request {
  user: AuthTokenPayload;
}

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  // @UseInterceptors(FileInterceptor('file')) // for single file upload
  async create(
    // @UploadedFile() file: any,
    @Body() body: CreateVisitDto,
    @Req() req: AuthRequest,
  ) {
    try {
      // const filePath = file ? `/uploads/other/${file?.filename}` : null;
      console.log({ body }, 'Request', req.user);
      const visit = await this.visitService.createVisit({
        ...body,
        ...req.user, // same as your req.user
        // filePath,
      });

      return {
        message: 'Visit created successfully',
        data: { id: visit?.id },
      };
    } catch (error) {
      console.error('Error creating visit:', error);
      throw new Error('Internal server error');
    }
  }

  @Get()
  async findAll(
    @Body() body: { id: string; role: Roles; org_id: string },
    @Req() req: AuthRequest,
  ) {
    try {
      // const { id, role, org_id } = req.user;
      const { id, role, org_id } = body;

      if (!role) {
        throw new HttpException('Unauthorized access', 401);
      }
      if (!org_id) {
        throw new HttpException('Organization not found', 404);
      }
      let visits;
      switch (role) {
        case Roles.CAREGIVER:
          visits = await this.visitService.getAllVisits(id);
          break;
        case Roles.SUPERVISOR:
          visits = this.visitService
            .getAllVisitsByOrganization
            // org_id,
            // paginationOption(req.query),
            ();
          break;
        case Roles.ADMIN:
          break;
        default:
          throw new HttpException('Unauthorized access', 401);
      }
      return visits;
    } catch (error) {
      console.error('Error creating visit:', error);
      throw new Error('Internal server error');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitService.findOne(+id);
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
