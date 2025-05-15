const utils = require("./utils");

module.exports = {
  dbGetComment: require("./dbGetComment"),
  dbCreateComment: require("./dbCreateComment"),
  dbUpdateComment: require("./dbUpdateComment"),
  dbDeleteComment: require("./dbDeleteComment"),
  dbListComment: require("./dbListComment"),
  createComment: utils.createComment,
  getIdListOfCommentByField: utils.getIdListOfCommentByField,
  getCommentById: utils.getCommentById,
  getCommentAggById: utils.getCommentAggById,
  getCommentListByQuery: utils.getCommentListByQuery,
  getCommentStatsByQuery: utils.getCommentStatsByQuery,
  getCommentByQuery: utils.getCommentByQuery,
  updateCommentById: utils.updateCommentById,
  updateCommentByIdList: utils.updateCommentByIdList,
  updateCommentByQuery: utils.updateCommentByQuery,
  deleteCommentById: utils.deleteCommentById,
  deleteCommentByQuery: utils.deleteCommentByQuery,
};
