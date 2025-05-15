const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");
const { hexaLogger } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const { CommentQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getCommentById = require("./utils/getCommentById");

//not

class DbUpdateCommentCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Comment, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdateComment";
    this.nullResult = false;
    this.objectName = "comment";
    this.serviceLabel = "mbproject-comment-service";
    this.joinedCriteria = false;
    this.dbEvent = "mbproject-comment-service-dbevent-comment-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  async createDbInstance() {
    this.dbInstance = await getCommentById(this.input.id);

    if (!this.dbInstance) {
      throw new NotFoundError("errMsg_RecordNotFoundToUpdate");
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdateComment = async (input) => {
  input.id = input.commentId;
  const dbUpdateCommand = new DbUpdateCommentCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateComment;
