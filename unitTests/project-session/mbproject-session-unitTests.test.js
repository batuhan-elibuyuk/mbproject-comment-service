const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { NotAuthorizedError } = require("common");

describe("mbproject-session", () => {
  beforeEach(() => {
    InstanceSession = proxyquire(
      "../../src/project-session/mbproject-session",
      {
        common: {
          hexaLogger: { log: sinon.stub() },
        },
        "../../src/project-session/hexa-auth": class {
          getBearerToken = sinon.stub();
          getCookieToken = sinon.stub();
        },

        "../../src/project-session/mbproject-permissions": class {},
      },
    );

    instance = new InstanceSession();
    instance.session = {}; // default dummy session
  });

  describe("userHasRole", () => {
    it("should return true if role matches string", () => {
      instance.session = { roleId: "admin" };
      expect(instance.userHasRole("admin")).to.be.true;
    });
    it("should return true if role in array", () => {
      instance.session = { roleId: ["admin"] };
      expect(instance.userHasRole("admin")).to.be.true;
    });
    it("should return false if role not matched", () => {
      instance.session = { roleId: "user" };
      expect(instance.userHasRole("admin")).to.be.false;
    });
  });

  describe("checkTokenLocations", () => {
    it("should return token from query param", async () => {
      const req = { query: { access_token: "token123" }, headers: {} };
      const result = await instance.checkTokenLocations(req);
      expect(result).to.deep.equal([
        "token123",
        false,
        "query",
        "access_token",
      ]);
    });

    it("should return token from bearer header", async () => {
      const req = { query: {}, headers: { Authorization: "Bearer abc" } };
      instance.getBearerToken = sinon.stub().returns("abc");
      const result = await instance.checkTokenLocations(req);
      expect(result).to.deep.equal(["abc", false, "bearer"]);
    });

    it("should return token from static header", async () => {
      const req = {
        query: {},
        headers: { "mbproject-access-token": "tok123" },
      };
      const result = await instance.checkTokenLocations(req);
      expect(result).to.deep.equal([
        "tok123",
        false,
        "header",
        "mbproject-access-token",
      ]);
    });

    it("should return token from static cookie", async () => {
      const req = { query: {}, headers: {} };
      instance.getCookieToken = sinon
        .stub()
        .withArgs("mbproject-access-token", req)
        .returns("cookie123");
      const result = await instance.checkTokenLocations(req);
      expect(result).to.deep.equal([
        "cookie123",
        false,
        "cookie",
        "mbproject-access-token",
      ]);
    });

    it("should return empty array if no token found", async () => {
      const req = { query: {}, headers: {} };
      instance.getBearerToken = sinon.stub().returns(null);
      instance.getCookieToken = sinon.stub().returns(null);

      const result = await instance.checkTokenLocations(req);
      expect(result).to.deep.equal([]);
    });
  });
});
