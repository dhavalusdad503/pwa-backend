import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { FieldInfo } from './field-info';

@Injectable()
export class QueryBuilderService {

  constructor() { }

  buildQuery<T>(
    fieldMap: Map<string, FieldInfo>,
    defaultColumns: string[],
    requestedFields: string[] | string = [],
    baseOptions: FindManyOptions<T> & {
      page?: number;
      limit?: number;
    } = {}
  ): FindManyOptions<T> {

    // 1. Determine fields to process
    let fields: string[] = [];
    if (requestedFields && requestedFields.length > 0) {
      if (Array.isArray(requestedFields)) {
        fields = [...requestedFields];
      } else {
        // If it's a single string, checking if it might be comma separated could be useful, 
        // but adhering to previous logic: treat as single item.
        fields = [requestedFields];
      }
    } else {
      fields = defaultColumns;
    }

    // 2. Initialize TypeORM options
    const select: any = {};
    const relations: any = {};

    // Helper to add fields to select object
    const addSelect = (target: any, field: string) => {
      target[field] = true;
    };

    // 3. Process each requested field
    for (const fieldKey of fields) {
      const info = fieldMap.get(fieldKey);

      if (!info) continue;

      const fieldList = Array.isArray(info.field) ? info.field : [info.field];

      if (info.association) {
        // Handle Association
        const assocName = info.association;

        // Add to relations
        relations[assocName] = true;

        // Initialize nested select for association if not exists
        if (!select[assocName]) {
          select[assocName] = {};
        }

        // Add fields to nested select
        fieldList.forEach(f => addSelect(select[assocName], f));
      } else {
        // Handle Main Entity Field
        fieldList.forEach(f => addSelect(select, f));
      }
    }

    // 4. Ensure default fields (id, timestamps) are selected for the main entity
    // Only if we are restricting fields (i.e., select is not empty)
    if (Object.keys(select).length > 0) {
      select.id = true;
      select.createdAt = true;
      select.updatedAt = true;
    }

    // 5. Handle Pagination and Base Options
    const { page, limit, ...otherOptions } = baseOptions;
    let skip = otherOptions.skip;
    let take = otherOptions.take;

    if (page && limit) {
      take = limit;
      skip = (page - 1) * limit;
    }

    // 6. Construct Final Options
    const options: FindManyOptions<T> = {
      ...otherOptions,
      select: Object.keys(select).length > 0 ? select : undefined,
      relations: Object.keys(relations).length > 0 ? relations : undefined,
      skip,
      take,
    };

    return options;
  }
}
