const mainFunctions = require("./main");

module.exports = {
  // main Database
  // Comment Db Object
  dbGetComment: mainFunctions.dbGetComment,
  dbCreateComment: mainFunctions.dbCreateComment,
  dbUpdateComment: mainFunctions.dbUpdateComment,
  dbDeleteComment: mainFunctions.dbDeleteComment,
  dbListComment: mainFunctions.dbListComment,
  createComment: mainFunctions.createComment,
  getIdListOfCommentByField: mainFunctions.getIdListOfCommentByField,
  getCommentById: mainFunctions.getCommentById,
  getCommentAggById: mainFunctions.getCommentAggById,
  getCommentListByQuery: mainFunctions.getCommentListByQuery,
  getCommentStatsByQuery: mainFunctions.getCommentStatsByQuery,
  getCommentByQuery: mainFunctions.getCommentByQuery,
  updateCommentById: mainFunctions.updateCommentById,
  updateCommentByIdList: mainFunctions.updateCommentByIdList,
  updateCommentByQuery: mainFunctions.updateCommentByQuery,
  deleteCommentById: mainFunctions.deleteCommentById,
  deleteCommentByQuery: mainFunctions.deleteCommentByQuery,
};
