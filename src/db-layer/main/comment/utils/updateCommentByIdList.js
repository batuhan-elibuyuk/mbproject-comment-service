const { HttpServerError } = require("common");

const { Comment } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const updateCommentByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;
    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };
    [rowsCount, rows] = await Comment.update(dataClause, options);
    const commentIdList = rows.map((item) => item.id);
    return commentIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingCommentByIdList", err);
  }
};

module.exports = updateCommentByIdList;
