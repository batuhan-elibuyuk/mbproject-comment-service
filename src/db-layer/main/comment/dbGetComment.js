const { sequelize } = require("common");
const { Op } = require("sequelize");
const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");

const { Comment } = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetCommentCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, Comment);
    this.commandName = "dbGetComment";
    this.nullResult = false;
    this.objectName = "comment";
    this.serviceLabel = "mbproject-comment-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Comment.getCqrsJoins) await Comment.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  createEntityCacher() {
    super.createEntityCacher();
    this.entityCacher = new CommentEntityCache();
    this.entityCacher.defaultId = this.input.commentId;
  }

  async transposeResult() {
    // transpose dbData
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbGetComment = (input) => {
  input.id = input.commentId;
  const dbGetCommand = new DbGetCommentCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetComment;
