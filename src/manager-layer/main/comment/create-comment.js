const CommentManager = require("./CommentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { CommentCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateComment } = require("dbLayer");

class CreateCommentManager extends CommentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createComment",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "comment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postId = this.postId;
    jsonObj.parentCommentId = this.parentCommentId;
    jsonObj.authorUserId = this.authorUserId;
    jsonObj.content = this.content;
    jsonObj.editedAt = this.editedAt;
    jsonObj.isEdited = this.isEdited;
    jsonObj.upvoteCount = this.upvoteCount;
    jsonObj.replyCount = this.replyCount;
  }

  readRestParameters(request) {
    this.postId = request.body?.postId;
    this.parentCommentId = request.body?.parentCommentId;
    this.authorUserId = request.session?.userId;
    this.content = request.body?.content;
    this.editedAt = request.body?.editedAt;
    this.isEdited = request.body?.isEdited;
    this.upvoteCount = request.body?.upvoteCount;
    this.replyCount = request.body?.replyCount;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  async setVariables() {}

  checkParameters() {
    // ID
    if (
      this.postId &&
      !isValidObjectId(this.postId) &&
      !isValidUUID(this.postId)
    ) {
      throw new BadRequestError("errMsg_postIdisNotAValidID");
    }

    // ID
    if (
      this.parentCommentId &&
      !isValidObjectId(this.parentCommentId) &&
      !isValidUUID(this.parentCommentId)
    ) {
      throw new BadRequestError("errMsg_parentCommentIdisNotAValidID");
    }

    // ID
    if (
      this.authorUserId &&
      !isValidObjectId(this.authorUserId) &&
      !isValidUUID(this.authorUserId)
    ) {
      throw new BadRequestError("errMsg_authorUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.comment?.authorUserId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateComment function to create the comment and return the result to the controller
    const comment = await dbCreateComment(this);

    return comment;
  }

  async raiseEvent() {
    CommentCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.commentId = this.id;
    if (!this.commentId) this.commentId = newUUID(false);

    const dataClause = {
      id: this.commentId,
      postId: this.postId,
      parentCommentId: this.parentCommentId,
      authorUserId: this.authorUserId,
      content: this.content,
      editedAt: this.editedAt,
      isEdited: this.isEdited,
      upvoteCount: this.upvoteCount,
      replyCount: this.replyCount,
    };

    return dataClause;
  }
}

module.exports = CreateCommentManager;
