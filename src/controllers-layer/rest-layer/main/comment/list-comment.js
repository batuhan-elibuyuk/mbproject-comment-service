const { HexaLogTypes, hexaLogger } = require("serviceCommon");

const { ListCommentManager } = require("managers");

const RestController = require("../../RestController");

class ListCommentRestController extends RestController {
  constructor(req, res, next) {
    super("listComment", "list-comment", req, res, next);
    this.dataName = "comments";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommentManager(this._req, "rest");
  }
}

const listComment = async (req, res, next) => {
  const listCommentRestController = new ListCommentRestController(
    req,
    res,
    next,
  );
  await listCommentRestController.processRequest();
};

module.exports = listComment;
