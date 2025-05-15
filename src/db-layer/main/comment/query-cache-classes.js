const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CommentQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("comment", [], Op.and, Op.eq, input, wClause);
  }
}
class CommentQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("comment", []);
  }
}

module.exports = {
  CommentQueryCache,
  CommentQueryCacheInvalidator,
};
