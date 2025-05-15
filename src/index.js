require("module-alias/register");

const env = process.env.NODE_ENV ?? "prod";
require("dotenv").config({ path: `.${env}.env` });

global.LIB = global.LIB ?? require("./library");

console.log("Starting mbproject-comment-service service...");
console.log(`Loaded .${env}.env file`);

const { hexaLogger, HexaLogTypes } = require("common");

/// build version ...
const { version } = require("../package.json");
const grpc = require("@grpc/grpc-js");
const grpcServer = require("./grpc-app");

const { updateElasticIndexMappings } = require("./models");

const {
  connectToKafka,
  closeKafka,
  connectToElastic,
  closeElastic,
  connectToRedis,
  redisClient,
  setRedisData,
  getRedisData,
  startPostgres,
  closePostgres,
} = require("./common");

const { ElasticIndexer } = require("serviceCommon");

const { startKafkaListeners } = require("./controllers-layer/kafka-layer");

const {
  initService,
  getPublicKey,
  setCurrentKeyId,
  startRepairElastic,
} = require("utils");

let processActive = false;
let expressServer = null;

const start = async () => {
  process.title = "node-mbproject-comment-service";
  try {
    await connectToElastic();
  } catch (err) {
    console.log("Starting ElasticSearch failed..", err.message);
  }

  const today = new Date();
  try {
    await hexaLogger.updateLoggerMappings();

    await hexaLogger.insertInfo(
      "LoadingService",
      { time: today.toUTCString() },
      "index.js->start",
    );
  } catch (err) {
    console.log("Error while loading logger mappings", err.message);
  }

  try {
    await connectToRedis();
    console.log("Testing Redis....");
    await setRedisData("mbproject-comment-service:start", today.toUTCString());
    console.log(
      "Service start datetime is written to Redis key mbproject-comment-service:start",
      today.toUTCString(),
    );
  } catch (err) {
    console.log("Redis test failed:", err);
    hexaLogger.insertError(
      "RedisConnectionFailedError",
      {},
      "index.js->start",
      err,
    );
  }

  try {
    await startPostgres();
  } catch (err) {
    console.log("Database start failed ", err);
    hexaLogger.insertError("DatabaseStartError", {}, "index.js->start", err);
  }

  await initService();

  await updateElasticIndexMappings();

  await startRepairElastic();

  const expressApp = require("./express-app");
  const servicePort = process.env.HTTP_PORT ?? 3000;

  expressServer = expressApp.listen(servicePort);
  console.log(
    "mbproject-comment-service is listening HTTP/REST port " +
      servicePort.toString(),
  );
  await hexaLogger.insertInfo(
    "ListeningHttpPort",
    { port: servicePort },
    "index.js->start",
    { date: today.toUTCString() },
  );

  grpcServer.bindAsync(
    "0.0.0.0:50000",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (!error) {
        grpcServer.start();
        console.log(`gRPC server is listening on port ${port}`);
      } else {
        console.log(`gRPC server failed with eror`, error.message);
      }
    },
  );

  if (process.env.NODE_ENV !== "dev") {
    try {
      // connect to kafka and start listeners
      await connectToKafka();
      const listenersActive = process.env.LISTENERS_ACTIVE
        ? process.env.LISTENERS_ACTIVE == "true"
        : true;
      if (listenersActive) {
        await startKafkaListeners();
        console.log("Kafka listeners are started...");
      }
    } catch (err) {
      console.log("Kafka cant be connected", err.message);
      hexaLogger.insertError(
        "KafkaConnectionFailedError",
        {},
        "index.js->",
        err,
      );
    }
  }

  // get public key from auth service
  await getPublicKey();

  processActive = true;
};

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

const secureClose = async (message, promise) => {
  try {
    console.log(message);
    await Promise.all([promise]);
  } catch (err) {
    console.log(err);
    hexaLogger.insertError(
      "SecureCloseFailedError",
      { function: "secureClose" },
      "index.js->secureClose",
      err,
    );
  }
};

const close = async (signal) => {
  try {
    console.log("Caught termination signal:", signal);
    if (processActive) {
      console.log("Closing all connections...");
      processActive = false;
      await secureClose("Closing express server...", expressServer.close());
      await secureClose("Closing kafka connection...", closeKafka());
      if (redisClient.isOpen) {
        await secureClose("Closing Redis connection...", redisClient.quit());
      }
      const insertCloseLogPromise = hexaLogger.insertInfo(
        "ClosingApp",
        { active_handles: process.getActiveResourcesInfo().length },
        "index.js->close",
      );
      await secureClose("Inserting exit log...", insertCloseLogPromise);
      await secureClose("Clearing old logs...", hexaLogger.clearAgedLogs());
      await secureClose("Closing elasticsearch connection...", closeElastic());
      console.log("Closed all connections gracefully...Bye!");
      process.exit();
    } else {
      console.log("Connections already closed...");
    }
  } catch (err) {
    hexaLogger.insertError(
      "CloseProcessFailedError",
      { function: "close" },
      "index.js->close",
      err,
    );
    process.exit();
  }
};

for (const signal of signals) {
  process.on(signal, async () => {
    if (!signals.includes(signal)) return;
    await close(signal);
  });
}

/* starting the server mbproject-comment-service .... */
start();

/* this project is created by MindBricks */
