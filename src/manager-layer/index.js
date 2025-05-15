module.exports = {
  CommentServiceManager: require("./service-manager/CommentServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Comment Db Object
  GetCommentManager: require("./main/comment/get-comment"),
  CreateCommentManager: require("./main/comment/create-comment"),
  UpdateCommentManager: require("./main/comment/update-comment"),
  DeleteCommentManager: require("./main/comment/delete-comment"),
  ListCommentManager: require("./main/comment/list-comment"),
};
