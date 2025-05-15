const commentFunctions = require("./comment");

module.exports = {
  // main Database
  // Comment Db Object
  dbGetComment: commentFunctions.dbGetComment,
  dbCreateComment: commentFunctions.dbCreateComment,
  dbUpdateComment: commentFunctions.dbUpdateComment,
  dbDeleteComment: commentFunctions.dbDeleteComment,
  dbListComment: commentFunctions.dbListComment,
  createComment: commentFunctions.createComment,
  getIdListOfCommentByField: commentFunctions.getIdListOfCommentByField,
  getCommentById: commentFunctions.getCommentById,
  getCommentAggById: commentFunctions.getCommentAggById,
  getCommentListByQuery: commentFunctions.getCommentListByQuery,
  getCommentStatsByQuery: commentFunctions.getCommentStatsByQuery,
  getCommentByQuery: commentFunctions.getCommentByQuery,
  updateCommentById: commentFunctions.updateCommentById,
  updateCommentByIdList: commentFunctions.updateCommentByIdList,
  updateCommentByQuery: commentFunctions.updateCommentByQuery,
  deleteCommentById: commentFunctions.deleteCommentById,
  deleteCommentByQuery: commentFunctions.deleteCommentByQuery,
};
