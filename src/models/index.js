const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const Comment = require("./comment");

Comment.prototype.getData = function () {
  const data = this.dataValues;

  data.parentComment = this.parentComment
    ? this.parentComment.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  data._owner = data.authorUserId ?? undefined;
  return data;
};

Comment.belongsTo(Comment, {
  as: "parentComment",
  foreignKey: "parentCommentId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  Comment,
  updateElasticIndexMappings,
};
