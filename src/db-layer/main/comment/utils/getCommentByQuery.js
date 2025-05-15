const { HttpServerError, BadRequestError } = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommentByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const comment = await Comment.findOne({ where: query });
    if (!comment) return null;
    return comment.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommentByQuery",
      err,
    );
  }
};

module.exports = getCommentByQuery;
