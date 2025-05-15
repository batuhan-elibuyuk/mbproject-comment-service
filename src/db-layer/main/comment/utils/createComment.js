const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { Comment } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "comment",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const allowedFields = [
    "id",
    "postId",
    "parentCommentId",
    "authorUserId",
    "content",
    "createdAt",
    "editedAt",
    "isEdited",
    "isActive",
    "upvoteCount",
    "replyCount",
  ];

  Object.keys(data).forEach((key) => {
    if (!allowedFields.includes(key)) {
      throw new BadRequestError(`Unexpected field "${key}" in input data.`);
    }
  });

  const requiredFields = [];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createComment = async (data) => {
  try {
    validateData(data);

    const newcomment = await Comment.create(data);
    const _data = newcomment.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenCreatingComment", err);
  }
};

module.exports = createComment;
