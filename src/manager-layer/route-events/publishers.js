const { ServicePublisher } = require("serviceCommon");

// Comment Event Publisher Classes

// Publisher class for create-comment route
const { CommentCreatedTopic } = require("./topics");
class CommentCreatedPublisher extends ServicePublisher {
  constructor(comment, session, requestId) {
    super(CommentCreatedTopic, comment, session, requestId);
  }

  static async Publish(comment, session, requestId) {
    const _publisher = new CommentCreatedPublisher(comment, session, requestId);
    await _publisher.publish();
  }
}

module.exports = {
  CommentCreatedPublisher,
};
