const { HexaLogTypes, hexaLogger } = require("serviceCommon");

const { DeleteCommentManager } = require("managers");

const RestController = require("../../RestController");

class DeleteCommentRestController extends RestController {
  constructor(req, res, next) {
    super("deleteComment", "delete-comment", req, res, next);
    this.dataName = "comment";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommentManager(this._req, "rest");
  }
}

const deleteComment = async (req, res, next) => {
  const deleteCommentRestController = new DeleteCommentRestController(
    req,
    res,
    next,
  );
  await deleteCommentRestController.processRequest();
};

module.exports = deleteComment;
