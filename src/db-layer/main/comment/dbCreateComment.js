const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { CommentQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommentById = require("./utils/getCommentById");

class DbCreateCommentCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateComment";
    this.objectName = "comment";
    this.serviceLabel = "mbproject-comment-service";
    this.dbEvent = "mbproject-comment-service-dbevent-comment-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new CommentQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "comment",
      this.session,
      this.requestId,
    );
    const dbData = await getCommentById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let comment = null;
    let whereClause = {};
    let updated = false;
    try {
      whereClause = {
        postId: this.dataClause.postId,
        parentCommentId: this.dataClause.parentCommentId,
      };

      comment = comment || (await Comment.findOne({ where: whereClause }));

      if (comment) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "postId-parentCommentId",
        );
      }
      whereClause = {
        authorUserId: this.dataClause.authorUserId,
        createdAt: this.dataClause.createdAt,
      };

      comment = comment || (await Comment.findOne({ where: whereClause }));

      if (comment) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "authorUserId-createdAt",
        );
      }

      if (!updated && this.dataClause.id) {
        comment = comment || (await Comment.findByPk(this.dataClause.id));
        if (comment) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await comment.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating Comment",
        eDetail,
      );
    }

    if (!updated) {
      comment = await Comment.create(this.dataClause);
    }

    this.dbData = comment.getData();
    this.input.comment = this.dbData;
    await this.create_childs();
  }
}

const dbCreateComment = async (input) => {
  const dbCreateCommand = new DbCreateCommentCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateComment;
