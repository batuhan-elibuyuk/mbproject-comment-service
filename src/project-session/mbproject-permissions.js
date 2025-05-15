const HexaPermissionManager = require("./hexa-permission");

const { ElasticIndexer } = require("serviceCommon");

class MbprojectPermissions extends HexaPermissionManager {
  constructor(hexaAuth) {
    super(hexaAuth);
    this.tenantId = null;
  }

  async getCurrentUserPermissions() {
    const roleId = this.session.roleId;
    const subjectUserId = this.session._USERID;
    const userGroupIdList = this.session.userGroupIdList;

    /* get All Given Permissions from elastic index for the permissionName */
    const elasticIndexer = new ElasticIndexer("givenPermission");
    const query = {
      bool: {
        must: [
          {
            bool: {
              should: [
                { term: { roleId: roleId } },
                { bool: { must_not: { exists: { field: "roleId" } } } },
              ],
            },
          },
        ],
      },
    };
    let permissions = await elasticIndexer.getDataByPage(0, 1000, query);
    return permissions ?? [];
  }

  async getCurrentRolePermissions() {
    const roleId = this.session.roleId;

    /* get All Given Permissions from elastic index for the permissionName */
    const elasticIndexer = new ElasticIndexer("givenPermission");
    const query = {
      bool: {
        must: [
          {
            bool: {
              should: [
                { term: { roleId: roleId } },
                { bool: { must_not: { exists: { field: "roleId" } } } },
              ],
            },
          },
        ],
      },
    };
    let permissions = await elasticIndexer.getDataByPage(0, 1000, query);
    return permissions ?? [];
  }

  // Collect all permissions from data store
  async getAllGivenPermissionsFromElastic(permissionName, objectId) {
    const roleId = this.session.roleId;
    const subjectUserId = this.session._USERID;
    const userGroupIdList = this.session.userGroupIdList;

    /* get All Given Permissions from elastic index for the permissionName */
    const elasticIndexer = new ElasticIndexer("givenPermission");
    const query = {
      bool: {
        must: [
          { term: { permissionName: permissionName } },
          {
            bool: {
              should: [
                { term: { roleId: roleId } },
                { bool: { must_not: { exists: { field: "roleId" } } } },
              ],
            },
          },
        ],
      },
    };
    let permissions = await elasticIndexer.getDataByPage(0, 1000, query);
    return permissions ?? [];
  }

  // Collect root permissions from data store
  async getRootGivenPermissionsFromElastic(permissionName) {
    const roleId = this.session.roleId;
    const subjectUserId = this.session._USERID;
    const userGroupIdList = this.session.userGroupIdList;

    /* get Root Given Permissions from elastic index for the permissionName */
    const elasticIndexer = new ElasticIndexer("givenPermission");
    const query = {
      bool: {
        must: [
          { term: { permissionName: permissionName } },
          {
            bool: {
              should: [
                { term: { roleId: roleId } },
                { bool: { must_not: { exists: { field: "roleId" } } } },
              ],
            },
          },
        ],
      },
    };
    let permissions = await elasticIndexer.getDataByPage(0, 1000, query);
    return permissions ?? [];
  }

  // Collect object permissions from data store
  async getObjectGivenPermissionsFromElastic(permissionName) {
    const roleId = this.session.roleId;
    const subjectUserId = this.session._USERID;
    const userGroupIdList = this.session.userGroupIdList;

    /* get Object Given Permissions from elastic index for the permissionName */
    const elasticIndexer = new ElasticIndexer("givenPermission");
    const query = {
      bool: {
        must: [
          { term: { permissionName: permissionName } },
          {
            bool: {
              should: [
                { term: { roleId: roleId } },
                { bool: { must_not: { exists: { field: "roleId" } } } },
              ],
            },
          },
        ],
      },
    };
    let permissions = await elasticIndexer.getDataByPage(0, 1000, query);
    return permissions ?? [];
  }
}

module.exports = MbprojectPermissions;
