const { HttpServerError, BadRequestError } = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommentListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    const comment = await Comment.findAll({ where: query });
    if (!comment) return [];
    return comment.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommentListByQuery",
      err,
    );
  }
};

module.exports = getCommentListByQuery;
