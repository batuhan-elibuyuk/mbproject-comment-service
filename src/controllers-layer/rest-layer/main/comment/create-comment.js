const { HexaLogTypes, hexaLogger } = require("serviceCommon");

const { CreateCommentManager } = require("managers");

const RestController = require("../../RestController");

class CreateCommentRestController extends RestController {
  constructor(req, res, next) {
    super("createComment", "create-comment", req, res, next);
    this.dataName = "comment";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommentManager(this._req, "rest");
  }
}

const createComment = async (req, res, next) => {
  const createCommentRestController = new CreateCommentRestController(
    req,
    res,
    next,
  );
  await createCommentRestController.processRequest();
};

module.exports = createComment;
