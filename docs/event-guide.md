# EVENT GUIDE

## mbproject-comment-service

Handles threaded comment creation, retrieval, and display on articles/discussions and on other comments. Supports editing, deleting, public access, and upvote metrics. All comments are always discoverable and public.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `Comment` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `Comment` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `Comment` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `Comment` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `Comment` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent comment-created

**Event topic**: `mbproject-comment-service-dbevent-comment-created`

This event is triggered upon the creation of a `comment` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "postId": "ID",
  "parentCommentId": "ID",
  "authorUserId": "ID",
  "content": "Text",
  "createdAt": "Date",
  "editedAt": "Date",
  "isEdited": "Boolean",
  "isActive": true,
  "upvoteCount": "Integer",
  "replyCount": "Integer",
  "recordVersion": "Integer",
  "updatedAt": "Date"
}
```

## DbEvent comment-updated

**Event topic**: `mbproject-comment-service-dbevent-comment-updated`

Activation of this event follows the update of a `comment` data object. The payload contains the updated information under the `comment` attribute, along with the original data prior to update, labeled as `old_comment`.

**Event payload**:

```json
{
  "old_comment": {
    "id": "ID",
    "_owner": "ID",
    "postId": "ID",
    "parentCommentId": "ID",
    "authorUserId": "ID",
    "content": "Text",
    "createdAt": "Date",
    "editedAt": "Date",
    "isEdited": "Boolean",
    "isActive": true,
    "upvoteCount": "Integer",
    "replyCount": "Integer",
    "recordVersion": "Integer",
    "updatedAt": "Date"
  },
  "comment": {
    "id": "ID",
    "_owner": "ID",
    "postId": "ID",
    "parentCommentId": "ID",
    "authorUserId": "ID",
    "content": "Text",
    "createdAt": "Date",
    "editedAt": "Date",
    "isEdited": "Boolean",
    "isActive": true,
    "upvoteCount": "Integer",
    "replyCount": "Integer",
    "recordVersion": "Integer",
    "updatedAt": "Date"
  }
}
```

## DbEvent comment-deleted

**Event topic**: `mbproject-comment-service-dbevent-comment-deleted`

This event announces the deletion of a `comment` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "postId": "ID",
  "parentCommentId": "ID",
  "authorUserId": "ID",
  "content": "Text",
  "createdAt": "Date",
  "editedAt": "Date",
  "isEdited": "Boolean",
  "isActive": false,
  "upvoteCount": "Integer",
  "replyCount": "Integer",
  "recordVersion": "Integer",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `Comment` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event comment-created

**Event topic**: `elastic-index-mbproject_comment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "postId": "ID",
  "parentCommentId": "ID",
  "authorUserId": "ID",
  "content": "Text",
  "createdAt": "Date",
  "editedAt": "Date",
  "isEdited": "Boolean",
  "isActive": true,
  "upvoteCount": "Integer",
  "replyCount": "Integer",
  "recordVersion": "Integer",
  "updatedAt": "Date"
}
```

## Index Event comment-updated

**Event topic**: `elastic-index-mbproject_comment-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "postId": "ID",
  "parentCommentId": "ID",
  "authorUserId": "ID",
  "content": "Text",
  "createdAt": "Date",
  "editedAt": "Date",
  "isEdited": "Boolean",
  "isActive": true,
  "upvoteCount": "Integer",
  "replyCount": "Integer",
  "recordVersion": "Integer",
  "updatedAt": "Date"
}
```

## Index Event comment-deleted

**Event topic**: `elastic-index-mbproject_comment-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "postId": "ID",
  "parentCommentId": "ID",
  "authorUserId": "ID",
  "content": "Text",
  "createdAt": "Date",
  "editedAt": "Date",
  "isEdited": "Boolean",
  "isActive": true,
  "upvoteCount": "Integer",
  "replyCount": "Integer",
  "recordVersion": "Integer",
  "updatedAt": "Date"
}
```

## Index Event comment-extended

**Event topic**: `elastic-index-mbproject_comment-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Route Event comment-created

**Event topic** : `mbproject-comment-service-comment-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `comment` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`comment`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "comment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "comment": { "id": "ID", "isActive": true }
}
```

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
