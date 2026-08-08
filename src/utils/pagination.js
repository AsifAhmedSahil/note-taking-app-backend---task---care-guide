const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const getPaginationParams = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isInteger(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  return { page, limit, skip: (page - 1) * limit };
};

export { getPaginationParams, DEFAULT_LIMIT, MAX_LIMIT };