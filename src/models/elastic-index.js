const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const commentMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  postId: { type: "keyword", index: true },
  parentCommentId: { type: "keyword", index: true },
  authorUserId: { type: "keyword", index: true },
  content: { type: "text", index: true },
  createdAt: { type: "date" },
  editedAt: { type: "date", index: false },
  isEdited: { type: "boolean", null_value: false },
  isActive: { type: "boolean" },
  upvoteCount: { type: "integer", index: true },
  replyCount: { type: "integer", index: true },
  recordVersion: { type: "integer" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("comment", commentMapping);
    await new ElasticIndexer("comment").updateMapping(commentMapping);
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
