const { getCommentById } = require("dbLayer");
const { Comment } = require("models");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");
const { Op } = require("sequelize");

const indexCommentData = async () => {
  const commentIndexer = new ElasticIndexer("comment", { isSilent: true });
  console.log("Starting to update indexes for Comment");

  const idListData = await Comment.findAll({
    attributes: ["id"],
  });
  const idList = idListData ? idListData.map((item) => item.id) : [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCommentById(chunk);
    if (dataList.length) {
      await commentIndexer.indexBulkData(dataList);
      await commentIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexCommentData();
    console.log(
      "Comment agregated data is indexed, total comments:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing Comment data",
      err.toString(),
    );
    hexaLogger.insertError(
      "ElasticIndexInitError",
      { function: "indexCommentData" },
      "syncElasticIndexData.js->indexCommentData",
      err,
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
