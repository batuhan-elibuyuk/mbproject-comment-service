const CommentManager = require("./CommentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbGetComment } = require("dbLayer");

class GetCommentManager extends CommentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getComment",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "comment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.commentId = this.commentId;
    jsonObj.id = this.id;
  }

  readRestParameters(request) {
    this.commentId = request.params?.commentId;
    this.id = request.params?.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async setVariables() {}

  async getDataFromElasticIndexUserAccount(query) {
    const elasticIndex = new ElasticIndexer("userAccount");
    return await elasticIndex.getOne(query);
  }

  async getForeignObjectAuthor() {
    const { convertUserQueryToElasticQuery } = require("common");
    const userQuery = {
      id: this.authorUserId,
    };
    const scriptQuery = convertUserQueryToElasticQuery(userQuery);
    console.log(scriptQuery);
    this.author = await this.getDataFromElasticIndexUserAccount(scriptQuery);

    this.author = this.author
      ? {
          username: this.author["username"],
        }
      : null;
  }

  async fetchForeignObjectsBeforeInstance() {
    await this.getForeignObjectAuthor();
  }

  checkParameters() {
    if (this.commentId == null) {
      throw new BadRequestError("errMsg_commentIdisRequired");
    }

    if (this.id == null) {
      throw new BadRequestError("errMsg_idisRequired");
    }

    // ID
    if (
      this.commentId &&
      !isValidObjectId(this.commentId) &&
      !isValidUUID(this.commentId)
    ) {
      throw new BadRequestError("errMsg_commentIdisNotAValidID");
    }
  }

  async fetchBefore() {
    await this.fetchForeignObjectsBeforeInstance();
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.comment?.authorUserId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetComment function to get the comment and return the result to the controller
    const comment = await dbGetComment(this);

    return comment;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.commentId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async addToOutput() {
    this.output.author = this.author;
  }
}

module.exports = GetCommentManager;
