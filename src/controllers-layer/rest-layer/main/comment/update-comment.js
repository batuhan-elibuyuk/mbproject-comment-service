const { HexaLogTypes, hexaLogger } = require("serviceCommon");

const { UpdateCommentManager } = require("managers");

const RestController = require("../../RestController");

class UpdateCommentRestController extends RestController {
  constructor(req, res, next) {
    super("updateComment", "update-comment", req, res, next);
    this.dataName = "comment";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommentManager(this._req, "rest");
  }
}

const updateComment = async (req, res, next) => {
  const updateCommentRestController = new UpdateCommentRestController(
    req,
    res,
    next,
  );
  await updateCommentRestController.processRequest();
};

module.exports = updateComment;
