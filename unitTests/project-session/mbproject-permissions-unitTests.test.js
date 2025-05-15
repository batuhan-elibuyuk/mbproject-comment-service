const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("MbprojectPermissions", () => {
  let MbprojectPermissions;
  let elasticStub;
  let instance;

  const session = {
    roleId: "role-1",
    _USERID: "user-1",
    userGroupIdList: ["group-1"],
  };

  beforeEach(() => {
    elasticStub = {
      getDataByPage: sinon.stub().resolves([{ permission: "read" }]),
    };

    MbprojectPermissions = proxyquire(
      "../../src/project-session/babilshop-permissions",
      {
        serviceCommon: {
          ElasticIndexer: function () {
            return elasticStub;
          },
        },
        "./hexa-permission": class {
          constructor() {
            this.session = session;
          }
        },
      },
    );

    instance = new MbprojectPermissions();
  });

  afterEach(() => sinon.restore());

  describe("getCurrentUserPermissions", () => {
    it("should return permissions from ElasticIndexer", async () => {
      const result = await instance.getCurrentUserPermissions();
      expect(elasticStub.getDataByPage.calledOnce).to.be.true;
      expect(result).to.deep.equal([{ permission: "read" }]);
    });

    it("should return empty array if no permissions found", async () => {
      elasticStub.getDataByPage.resolves(null);
      const result = await instance.getCurrentUserPermissions();
      expect(result).to.deep.equal([]);
    });

    it("should throw if ElasticIndexer fails", async () => {
      elasticStub.getDataByPage.rejects(new Error("Elastic error"));
      try {
        await instance.getCurrentUserPermissions();
      } catch (err) {
        expect(err.message).to.equal("Elastic error");
      }
    });
  });

  describe("getCurrentRolePermissions", () => {
    it("should fetch role permissions from ElasticIndexer", async () => {
      const result = await instance.getCurrentRolePermissions();
      expect(elasticStub.getDataByPage.calledOnce).to.be.true;
      expect(result).to.deep.equal([{ permission: "read" }]);
    });
  });

  describe("getAllGivenPermissionsFromElastic", () => {
    it("should query by permission name and return results", async () => {
      const result = await instance.getAllGivenPermissionsFromElastic(
        "read-doc",
        "obj-1",
      );
      expect(elasticStub.getDataByPage.calledOnce).to.be.true;
      expect(
        elasticStub.getDataByPage.firstCall.args[2].bool.must[0].term
          .permissionName,
      ).to.equal("read-doc");
      expect(result).to.deep.equal([{ permission: "read" }]);
    });

    it("should return [] if no data from ElasticIndexer", async () => {
      elasticStub.getDataByPage.resolves(null);
      const result = await instance.getAllGivenPermissionsFromElastic("x", "y");
      expect(result).to.deep.equal([]);
    });
  });

  describe("getRootGivenPermissionsFromElastic", () => {
    it("should query root-level permissions by name", async () => {
      const result =
        await instance.getRootGivenPermissionsFromElastic("delete-all");
      expect(elasticStub.getDataByPage.calledOnce).to.be.true;
      expect(result).to.deep.equal([{ permission: "read" }]);
    });
  });

  describe("getObjectGivenPermissionsFromElastic", () => {
    it("should fetch object-level permissions by name", async () => {
      const result =
        await instance.getObjectGivenPermissionsFromElastic("object-access");
      expect(elasticStub.getDataByPage.calledOnce).to.be.true;
      expect(result).to.deep.equal([{ permission: "read" }]);
    });
  });
});
