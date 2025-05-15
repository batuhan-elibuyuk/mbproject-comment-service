const express = require("express");

// Comment Db Object Rest Api Router
const commentRouter = express.Router();

// add Comment controllers

// get-comment controller
commentRouter.get("/comment/:id", require("./get-comment"));
// create-comment controller
commentRouter.post("/comment", require("./create-comment"));
// update-comment controller
commentRouter.patch("/comment/:id", require("./update-comment"));
// delete-comment controller
commentRouter.delete("/comment/:id", require("./delete-comment"));
// list-comment controller
commentRouter.get("/comment", require("./list-comment"));

module.exports = commentRouter;
