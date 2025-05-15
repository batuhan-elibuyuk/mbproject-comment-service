const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "mbproject - comment",
    brand: {
      name: "mbproject",
      image: "https://mindbricks.com/images/logo-light.svg",
      moduleName: "comment",
    },
    auth: {
      url: authUrl,
    },
    dataObjects: [
      {
        name: "Comment",
        description:
          "A public threaded comment or reply attached to an article/discussion post or another comment. Stores author, parent, content, visibility, and real-time engagement counts.",
        reference: {
          tableName: "comment",
          properties: [
            {
              name: "postId",
              type: "ID",
            },

            {
              name: "parentCommentId",
              type: "ID",
            },

            {
              name: "authorUserId",
              type: "ID",
            },

            {
              name: "content",
              type: "Text",
            },

            {
              name: "createdAt",
              type: "Date",
            },

            {
              name: "editedAt",
              type: "Date",
            },

            {
              name: "isEdited",
              type: "Boolean",
            },

            {
              name: "isActive",
              type: "Boolean",
            },

            {
              name: "upvoteCount",
              type: "Integer",
            },

            {
              name: "replyCount",
              type: "Integer",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/comment/{id}",
            title: "getCommentById",
            query: [],

            parameters: [
              {
                key: "commentId",
                value: "",
                description: "",
              },
              {
                key: "id",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/comment",
            title: "createComment",
            query: [],

            body: {
              type: "json",
              content: {
                postId: "ID",
                parentCommentId: "ID",
                content: "Text",
                editedAt: "Date",
                isEdited: "Boolean",
                upvoteCount: "Integer",
                replyCount: "Integer",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/comment/{id}",
            title: "updateOwnComment",
            query: [],

            body: {
              type: "json",
              content: {
                content: "Text",
                editedAt: "Date",
                isEdited: "Boolean",
                isActive: "Boolean",
              },
            },

            parameters: [
              {
                key: "commentId",
                value: "",
                description: "",
              },
              {
                key: "id",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/comment/{id}",
            title: "deleteOwnComment",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "commentId",
                value: "",
                description: "",
              },
              {
                key: "id",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/comment",
            title: "listComments",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
