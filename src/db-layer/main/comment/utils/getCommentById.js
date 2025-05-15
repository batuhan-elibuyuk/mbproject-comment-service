const { HttpServerError } = require("common");

let { Comment } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCommentById = async (commentId) => {
  try {
    const comment = Array.isArray(commentId)
      ? await Comment.findAll({
          where: {
            id: { [Op.in]: commentId },
          },
        })
      : await Comment.findByPk(commentId);
    if (!comment) {
      return null;
    }
    return Array.isArray(commentId)
      ? (comment.map = (item) => item.getData())
      : comment.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingCommentById", err);
  }
};

module.exports = getCommentById;
