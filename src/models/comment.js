const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A public threaded comment or reply attached to an article/discussion post or another comment. Stores author, parent, content, visibility, and real-time engagement counts.
const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    postId: {
      // The ID of the article or discussion (post) this comment is attached to.
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentCommentId: {
      // The ID of the parent comment for replies; null for top-level comments.
      type: DataTypes.UUID,
      allowNull: true,
    },
    authorUserId: {
      // ID of the userAccount that authored this comment.
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      // Main comment body (supports markdown/plain text; sanitization enforced at API level).
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      // Timestamp when comment was created.
      type: DataTypes.DATE,
      allowNull: false,
    },
    editedAt: {
      // Timestamp when comment was last edited (null if never edited).
      type: DataTypes.DATE,
      allowNull: true,
    },
    isEdited: {
      // Whether comment was edited after initial creation.
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isActive: {
      // If false, comment is deleted and should not be shown in normal queries. Soft delete only.
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    upvoteCount: {
      // Public upvote count for this comment, synced from engagement service.
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    replyCount: {
      // Live count of direct replies to this comment (threaded replies, not transitive children).
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["postId"],
      },
      {
        unique: false,
        fields: ["parentCommentId"],
      },
      {
        unique: false,
        fields: ["authorUserId"],
      },
      {
        unique: false,
        fields: ["createdAt"],
      },
      {
        unique: false,
        fields: ["isActive"],
      },

      {
        unique: true,
        fields: ["postId", "parentCommentId"],
        where: { isActive: true },
      },
      {
        unique: true,
        fields: ["authorUserId", "createdAt"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Comment;
