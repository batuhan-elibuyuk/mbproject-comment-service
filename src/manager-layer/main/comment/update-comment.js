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
const { dbUpdateComment } = require("dbLayer");

class UpdateCommentManager extends CommentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateComment",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "comment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.commentId = this.commentId;
    jsonObj.content = this.content;
    jsonObj.editedAt = this.editedAt;
    jsonObj.isEdited = this.isEdited;
    jsonObj.isActive = this.isActive;
    jsonObj.id = this.id;
  }

  readRestParameters(request) {
    this.commentId = request.params?.commentId;
    this.content = request.body?.content;
    this.editedAt = request.body?.editedAt;
    this.isEdited = request.body?.isEdited;
    this.isActive = request.body?.isActive;
    this.id = request.params?.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async setVariables() {}

  async fetchInstance() {
    const { getCommentById } = require("dbLayer");
    this.comment = await getCommentById(this.commentId);
    if (!this.comment) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
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

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.comment?.authorUserId === this.session.userId;
  }

  checkAbsolute() {
    // Check if user has an absolute role to ignore all authorization validations and return
    if (this.userHasRole(this.ROLES.admin)) {
      this.absoluteAuth = true;
      return true;
    }
    return false;
  }

  async checkLayer3AuthValidations() {
    // check ownership of the record agianst the session user
    if (!this.isOwner) {
      throw new ForbiddenError("errMsg_commentCanBeAccessedByOwner");
    }

    //check 401 validations
  }

  async checkLayer1BusinessValidations() {
    //check Layer1 validations

    // Validation Check: routeRoleCheck
    // Check if the logged in user has [admin] roles
    if (!this.userHasRole(this.ROLES.admin)) {
      throw new BadRequestError(
        "errMsg_userShoudlHave[admin]RoleToAccessRoute",
      );
    }
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateComment function to update the comment and return the result to the controller
    const comment = await dbUpdateComment(this);

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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      content: this.content,
      editedAt: this.editedAt,
      isEdited: this.isEdited,
      isActive: this.isActive,
    };

    return dataClause;
  }
}

module.exports = UpdateCommentManager;
