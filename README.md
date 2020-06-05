## **Introduction to GraphQL**

**1.** GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.
**2.** A GraphQL service is created by defining types and fields on those types, then providing functions for each field on each type. For example, a GraphQL service that tells us who the logged in user is (me) as well as that user's name might look something like this:  
`type Query {`
`me: User`
`}`

`type User {`
`id: ID`
`name: String`
`}`

### Along with functions for each field on each type:

`function Query_me(request) {`
`return request.auth.user;`
`}`

`function User_name(user) {`
`return user.getName();`
`}`

**3.** Once a GraphQL service is running (typically at a URL on a web service), it can receive GraphQL queries to validate and execute. A received query is first checked to ensure it only refers to the types and fields defined, then runs the provided functions to produce a result.

## Difference between GraphQL and Rest.

The core idea of REST is the resource. Each resource is identified by a URL, and you retrieve that resource by sending a GET request to that URL. You will likely get a JSON response, since that’s what most APIs are using these days. So it looks something like:

`GET /books/1{`
`"title": "Black Hole Blues",`
`"author": {`
`"firstName": "Janna",`
`"lastName": "Levin"`
`}`
`// ... more fields here`
`}`
Note: In the example above, some REST APIs would return “author” as a separate resource.

One thing to note in REST is that the type, or shape, of the resource and the way you fetch that resource are coupled. When you talk about the above in REST documentation, you might refer to it as the “book endpoint”.

GraphQL is quite different in this respect, because in GraphQL these two concepts are completely separate. In your schema, you might have Book and Author types:

`type Book {`
`id: ID`
`title: String`
`published: Date`
`price: String`
`author: Author`
`}type Author {`
`id: ID`
`firstName: String`
`lastName: String`
`books: [Book]`
`}`

Notice that we have described the kinds of data available, but this description doesn’t tell you anything at all about how those objects might be fetched from a client. That’s one core difference between REST and GraphQL — the description of a particular resource is not coupled to the way you retrieve it.

To be able to actually access a particular book or author, we need to create a Query type in our schema:

`type Query {`
`book(id: ID!): Book`
`author(id: ID!): Author`
`}`
Now, we can send a request similar to the REST request above, but with GraphQL this time:

`GET /graphql?query={ book(id: "1") { title, author { firstName } } }{`
`"title": "Black Hole Blues",`
`"author": {`
`"firstName": "Janna",`
`}`
`}`
Nice, now we’re getting somewhere! We can immediately see a few things about GraphQL that are quite different from REST, even though both can be requested via URL, and both can return the same shape of JSON response.

First of all, we can see that the URL with a GraphQL query specifies the resource we’re asking for and also which fields we care about. Also, rather than the server author deciding for us that the related author resource needs to be included, the consumer of the API decides.

But most importantly, the identities of the resources, the concepts of Books and Authors, are not coupled to the way they are fetched. We could potentially retrieve the same Book through many different types of queries, and with different sets of fields.

### Conclusion

We’ve identified some similarities and differences already:

**Similar**: Both have the idea of a resource, and can specify IDs for those resources.
**Similar**: Both can be fetched via an HTTP GET request with a URL.
**Similar**: Both can return JSON data in the request.
**Different**: In REST, the endpoint you call is the identity of that object. In GraphQL, the identity is separate from how you fetch it.
**Different**: In REST, the shape and size of the resource is determined by the server. In GraphQL, the server declares what resources are available, and the client asks for what it needs at the time.

## Build a schema

Create the blueprint for your data graph
Every data graph uses a schema to define the types of data it includes. For example, the schema for an online bookstore might define the following types:

`type Book {`
`title: String`
`author: Author`
`}`

`type Author {`
`name: String`
`books: [Book]`
`}`
In the steps below, we'll set up a GraphQL server that will enforce our schema's structure, and then we'll define the schema itself.

## Set up Apollo Server

A schema is only useful if our data graph conforms to the schema's structure. Enforcing a schema's structure is one of the core features of Apollo Server, a production-ready, open-source library that helps you implement your data graph's API.

From the start/server directory, let's install Apollo Server (along with our project's other dependencies):

#### cd start/server && npm install

The two packages you need to get started with Apollo Server are apollo-server and graphql, both of which are installed with the above command.

Now, let's navigate to src/index.js so we can create our server. Paste the code below into the file:

#### src/index.js

`const { ApolloServer } = require('apollo-server');`
`const typeDefs = require('./schema');`

`const server = new ApolloServer({ typeDefs });`
This code imports the ApolloServer class from apollo-server, along with our (currently undefined) schema from src/schema.js. It then creates a new instance of ApolloServer and passes it the imported schema via the typeDefs property.

Now that Apollo Server is prepared to receive our schema, let's define it.

### Define your schema's types

Your GraphQL schema defines what types of data a client can read and write to your data graph. Schemas are strongly typed, which unlocks powerful developer tooling.

In src/schema.js, import gql from apollo-server and create a variable called typeDefs for your schema:

#### src/schema.js

`const { gql } = require('apollo-server');`
`const typeDefs = gql`
`# Your schema will go here`
`;`

module.exports = typeDefs;
The schema will go inside the gql function (between the backticks). The language we'll use to write the schema is GraphQL's schema definition language (SDL).

Because the schema sits directly between your application clients and your underlying data services, front-end and back-end teams should collaborate on its structure. When you develop your own data graph, practice schema-first development and agree on a schema before you begin implementing your API.

### Object types

Most of the definitions in a GraphQL schema are object types. Each object type you define should represent an object that an application client might need to interact with.

For example, our example app needs to be able to fetch a list of upcoming rocket launches, so we should define a Launch type to support that behavior.

Paste the following inside the backticks of the typeDefs declaration in src/schema.js:

#### src/schema.js

`type Launch {`
`id: ID!`
`site: String`
`mission: Mission`
`rocket: Rocket`
`isBooked: Boolean!`
`}`
The Launch object type has a collection of fields, and each field has a type of its own. A field's type can be either an object type or a scalar type. A scalar type is a primitive (like ID, String, Boolean, or Int) that resolves to a single value. In addition to GraphQL's built-in scalar types, you can define custom scalar types.

An exclamation point (!) after a declared field's type means "this field's value can never be null."

In the Launch definition above, Mission and Rocket refer to other object types. Let's add definitions for those, along with the User type (again, all inside the backticks):

#### src/schema.js

`type Rocket {`
`id: ID!`
`name: String`
`type: String`
`}`

`type User {`
`id: ID!`
`email: String!`
`trips: [Launch]!`
`}`

`type Mission {`
`name: String`
`missionPatch(size: PatchSize): String`
`}`

`enum PatchSize {`
`SMALL`
`LARGE`
`}`

If a declared field's type is in [Square Brackets], it's an array of the specified type. If an array has an exclamation point after it, the array cannot be null, but it can be empty.

### Query type

We've defined the objects that exist in our data graph, but clients don't yet have a way to fetch those objects. To resolve that, our schema needs to define queries that clients can execute against the data graph.

You define your data graph's supported queries as fields of a special type called the Query type. Paste the following into your schema definition:

#### src/schema.js

`type Query {`
`launches: [Launch]!`
`launch(id: ID!): Launch`
`me: User`
`}`
This Query type defines three available queries for clients to execute: launches, launch, and me.

The launches query will return an array of all upcoming Launches.
The launch query will return a single Launch that corresponds to the id argument provided to the query.
The me query will return details for the User that's currently logged in.

### The Mutation type

Queries enable clients to fetch data, but not to modify data. To enable clients to modify data, our schema needs to define some mutations.

The Mutation type is a special type that's similar in structure to the Query type. Paste the following into your schema definition:

#### src/schema.js

`type Mutation {`
`bookTrips(launchIds: [ID]!): TripUpdateResponse!`
`cancelTrip(launchId: ID!): TripUpdateResponse!`
`login(email: String): String # login token`
`}`
This Mutation type defines three available mutations for clients to execute: bookTrips, cancelTrip, and login.

The bookTrips mutation enables a logged-in user to book a trip on one or more Launches (specified by an array of launch IDs).
The cancelTrip mutation enables a logged-in user to cancel a trip that they previously booked.
The login mutation enables a user to log in by providing their email address.
The bookTrips and cancelTrip mutations return the same object type: a TripUpdateResponse. A mutation's return type is entirely up to you, but we recommend defining special object types specifically for mutation responses.

Add the definition for TripUpdateResponse to your schema:

#### src/schema.js

`type TripUpdateResponse {`
`success: Boolean!`
`message: String`
`launches: [Launch]`
`}`
This response type contains a success status, a corresponding message, and an array of any Launches that were modified by the mutation. It's good practice for a mutation to return whatever objects it modifies so the requesting client can update its cache and UI without needing to make a followup query.

## Resolvers

A resolver is a function that's responsible for populating the data for a single field in your schema. It can populate that data in any way you define, such as by fetching data from a back-end database or a third-party API.

If you don't define a resolver for a particular field, Apollo Server automatically defines a default resolver for it.

### Defining a resolver

Base syntax
Let's say our server defines the following (very short) schema:

`type Query {`
`numberSix: Int! # Should always return the number 6 when queried`
`numberSeven: Int! # Should always return 7`
`}`
We want to define resolvers for the numberSix and numberSeven fields of the root Query type so that they always return 6 and 7 when they're queried.

Those resolver definitions look like this:

`const resolvers = {`
`Query: {`
`numberSix() {`
`return 6;`
`},`
`numberSeven() {`
`return 7;`
`}`
`}`
`};`
As this example shows:
You define all of your server's resolvers in a single JavaScript object (named resolvers above). This object is called the resolver map.
The resolver map has top-level fields that correspond to your schema's types (such as Query above).
Each resolver function belongs to whichever type its corresponding field belongs to.

### Handling arguments

Now let's say our server defines the following (slightly longer) schema:

`type User {`
`id: ID!`
`name: String`
`}`

`type Query {`
`user(id: ID!): User`
`}`
We want to be able to query the user field to fetch a user by its id.

To achieve this, our server needs access to user data. For this contrived example, assume our server defines the following hardcoded array:

`const users = [`
`{`
`id: '1',`
`name: 'Elizabeth Bennet'`
`},`
`{`
`id: '2',`
`name: 'Fitzwilliam Darcy'`
`}`
`];`
To learn how to fetch data from an external source (like a database or REST API), see Data sources.

Now we can define a resolver for the user field, like so:

`const resolvers = {`
`Query: {`
`user(parent, args, context, info) {`
`return users.find(user => user.id === args.id);`
`}`
`}`
`}`
As this example shows:
A resolver can optionally accept four positional arguments: (parent, args, context, info).
# apollo-server
