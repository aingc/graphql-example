const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
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

// Schema defines query section, query section defines all the diff use cases we can use for querying, inside each diff obj, we have fields which are all diff section of that obj which we can query to return data from
// the resolve is what actual info that we are returning from this field, how do we get the info from this field and return it: comes with few arguments... parent, args
const schema = new GraphQLSchema({
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
})

//graphql knows which data to access based on query that you send it when a scheme is defined, need to pass through expressGraphQL function
app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true //gives ui to access graph ql server without having to manually call it through something like postman
}));
app.listen(5000., () => console.log('Server running'));