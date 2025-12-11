// utils/dynamicQueryBuilder.ts
import { AggregateOptions, FindOptions, IncludeOptions, Model, ModelStatic } from 'sequelize';

interface FieldInfo {
  model?: ModelStatic<any> | null;
  field: string | string[];
  association?: string | null;
}

export function buildDynamicQuery<T extends Model>(
  fieldMap: Map<string, FieldInfo>,
  defaultColumns: string[],
  requestedFields: string[] | string = [],
  baseOptions: FindOptions & AggregateOptions<T> & {
    page?: number;
    limit?: number;
  } = {}
): FindOptions {

  const mainFields: string[] = [];
  const assocGroups: Record<string, string[]> = {};

  let fields: string[] = [];

  if (requestedFields) {
    if (Array.isArray(requestedFields)) {
      fields = [...requestedFields];
    } else {
      fields = [requestedFields];
    }
  } else {
    fields = defaultColumns;
  }

  // Parse requested fields using provided fieldMap
  for (const field of fields) {
    const fieldInfo = fieldMap.get(field);

    if (!fieldInfo) continue;

    if (!fieldInfo.association) {
      if (Array.isArray(fieldInfo.field)) {
        mainFields.push(...fieldInfo.field);  // Spread array into individual items
      } else {
        mainFields.push(fieldInfo.field);     // Single string
      }
    } else {
      if (!assocGroups[fieldInfo.association]) {
        assocGroups[fieldInfo.association] = [];
      }
      if (Array.isArray(fieldInfo.field)) {
        assocGroups[fieldInfo.association].push(...fieldInfo.field);
      } else {
        assocGroups[fieldInfo.association].push(fieldInfo.field);
      }
    }
  }

  if (!mainFields.includes("id")) mainFields.push("id");
  if (!mainFields.includes("createdAt")) mainFields.push("createdAt");
  if (!mainFields.includes("updatedAt")) mainFields.push("updatedAt");

  // Build includes only for requested associations
  const includes: IncludeOptions[] = Object.entries(assocGroups).map(([assocName, assocAttrs]) => {
    // Find model info from any field in this association group
    const sampleFieldInfo = Array.from(fieldMap.values()).find(info =>
      info.association === assocName
    );

    return {
      model: sampleFieldInfo?.model!,
      as: assocName,
      attributes: assocAttrs,
    };
  });

  return {
    ...baseOptions,
    attributes: mainFields.length ? mainFields : undefined,
    include: Object.keys(assocGroups).length ? includes : [],
    raw: false
  } as FindOptions;
}
