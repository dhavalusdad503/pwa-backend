// import { CommonPaginationOptionType } from '@types';
// import logger from '@utils/logger';

import { AppLogger } from '@common/logger/app.logger';
import { CommonPaginationOptionType } from '@common/types';

export const paginationOption = (query: CommonPaginationOptionType) => {
  const logger = new AppLogger('Pagination');
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortColumn = '',
      sortOrder = '',
    } = query;

    const options = {
      page: Number(page),
      limit: Number(limit),
      search: String(search),
      sortColumn: String(sortColumn),
      sortOrder: String(sortOrder).toUpperCase(),
    };
    return { ...query, options };
  } catch (error) {
    logger.error('Error in paginationOption', error);
    return query;
  }
};
