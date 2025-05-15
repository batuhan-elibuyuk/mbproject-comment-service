module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Comment Db Object
  GetCommentManager: require("./comment/get-comment"),
  CreateCommentManager: require("./comment/create-comment"),
  UpdateCommentManager: require("./comment/update-comment"),
  DeleteCommentManager: require("./comment/delete-comment"),
  ListCommentManager: require("./comment/list-comment"),
};
