const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetCommentRestController also from file get-comment.js
describe("GetCommentRestController", () => {
  let GetCommentRestController, getComment;
  let GetCommentManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetCommentManager constructor
    GetCommentManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetCommentRestController, getComment } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/comment/get-comment.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetCommentManager: GetCommentManagerStub,
        },
        "../../RestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetCommentRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetCommentRestController(req, res, next);

      expect(controller.name).to.equal("getComment");
      expect(controller.routeName).to.equal("get-comment");
      expect(controller.dataName).to.equal("comment");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetCommentManager in createApiManager()", () => {
      const controller = new GetCommentRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetCommentManagerStub.calledOnceWithExactly(req, "rest")).to.be
        .true;
    });
  });

  describe("getComment function", () => {
    it("should create instance and call processRequest", async () => {
      await getComment(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
