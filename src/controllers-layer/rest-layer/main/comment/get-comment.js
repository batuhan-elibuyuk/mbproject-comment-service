const { HexaLogTypes, hexaLogger } = require("serviceCommon");

const { GetCommentManager } = require("managers");

const RestController = require("../../RestController");

class GetCommentRestController extends RestController {
  constructor(req, res, next) {
    super("getComment", "get-comment", req, res, next);
    this.dataName = "comment";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommentManager(this._req, "rest");
  }
}

const getComment = async (req, res, next) => {
  const getCommentRestController = new GetCommentRestController(req, res, next);
  await getCommentRestController.processRequest();
};

module.exports = getComment;
