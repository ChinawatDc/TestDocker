import { ApolloServer, gql } from 'apollo-server';

const users = [
    {name: "Pluem", sex : "Male"},
    {name: "LUES", sex: "Male"},
    {name: "C", sex: "?"},
    {name: "D", sex: "?"},
    {name: "E", sex: "?"},
  ];
//schema
const typeDefs = gql`
type Query {
    hello: String
    hi : String
    users: [User]
    user(name:String): User
 }
 type User {
    name : String
    sex : String
  }
 `;
//resolver
const resolvers = {
    Query : {
       hello: (parent, args, context, info) => {
           return "world";
       },
       users: (parent, args, context, info) => {
         return users;
       },
       user:(parent, args, context, info) => {
         return users.find(user => user.name === args.name);
       },
    }
   };
//function apollo-server
const startApolloServer = async (typeDefs, resolvers) => {
    const server = new ApolloServer({ typeDefs,resolvers});
    const { url } = await server.listen();//{url} = {url......,port...}
    console.log(`Server ready at ${url}`);
};
//
//call funtion
startApolloServer(typeDefs, resolvers);
