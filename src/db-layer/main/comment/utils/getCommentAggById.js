const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");

const getCommentAggById = async (commentId) => {
  try {
    const forWhereClause = false;
    const includes = [];
    const comment = Array.isArray(commentId)
      ? await Comment.findAll({
          where: {
            id: { [Op.in]: commentId },
          },
          include: includes,
        })
      : await Comment.findByPk(commentId, { include: includes });

    if (!comment) {
      return null;
    }

    const commentData =
      Array.isArray(commentId) && commentId.length > 0
        ? comment.map((item) => item.getData())
        : comment.getData();
    await Comment.getCqrsJoins(commentData);
    return commentData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommentAggById",
      err,
    );
  }
};

module.exports = getCommentAggById;
