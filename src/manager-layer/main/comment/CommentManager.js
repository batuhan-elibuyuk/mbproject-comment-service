const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");

const CommentServiceManager = require("../../service-manager/CommentServiceManager");

/* Base Class For the Crud Routes Of DbObject Comment */
class CommentManager extends CommentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "comment";
    this.modelName = "Comment";
    this.routeResourcePath = "";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = CommentManager;
