const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getIdListOfCommentByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const commentProperties = [
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

    isValidField = commentProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Comment[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let commentIdList = await Comment.findAll(options);

    if (!commentIdList || commentIdList.length === 0) {
      throw new NotFoundError(`Comment with the specified criteria not found`);
    }

    commentIdList = commentIdList.map((item) => item.id);
    return commentIdList;
  } catch (err) {
    hexaLogger.insertError(
      "DatabaseError",
      { function: "getIdListOfCommentByField", fieldValue: fieldValue },
      "getIdListOfCommentByField.js->getIdListOfCommentByField",
      err,
      null,
    );
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommentIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCommentByField;
