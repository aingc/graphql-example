const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
];

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

//define BookType custom graphql obj type
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: { 
      type: AuthorType,
      //because books does not have an author field, we need to specify a custom resolve for how we get this author
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: { 
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
});

// Schema defines query section, query section defines all the diff use cases we can use for querying, inside each diff obj, we have fields which are all diff section of that obj which we can query to return data from
// the resolve is what actual info that we are returning from this field, how do we get the info from this field and return it: comes with few arguments... parent, args
/*const schema = new GraphQLSchema({
  //define dummy schema

  //define query param
  query: new GraphQLObjectType({
    //name, no spaces
    name: 'HelloWorld',
    // define fields that defined name returns
    fields: () => ({
      //inside this function we return the diff fields we want to return
      //message obj that defines the type of our message,
      message: {
        type:  GraphQLString,
        resolve: () => 'Hello World'
      }
    })
  })
})*/

//graphql powerful in the part that you can create a lot of endpoint without needing to create new routes, you just create a single query field, which you query for that actual obj, once that obj is defined
//you don't need to do much hard work to redefine how that obj is used for that new query, you just use the obj that's already defined
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({ //wrapped in () is equivalent to return
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {//define which arguments are valid for this query
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id) //with a db you would do a db query instead in order to get this
    },
    books: {
      type: new GraphQLList(BookType), //Custom GraphQL obj type
      description: 'List of All Books',
      resolve: () => books //we're returning a list of book types so we need to import GraphQLList
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args : {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType), //Custom GraphQL obj type
      description: 'List of All Authors',
      resolve: () => authors //we're returning a list of book types so we need to import GraphQLList
    },
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType
});

//graphql knows which data to access based on query that you send it when a scheme is defined, need to pass through expressGraphQL function
app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true //gives ui to access graph ql server without having to manually call it through something like postman
}));
app.listen(5000., () => console.log('Server running'));