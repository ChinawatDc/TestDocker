import { ApolloServer, gql } from 'apollo-server';

<<<<<<< HEAD
const user = [
    {name: "Pluem", sex : "Male", id: 0},
    {name: "LUES", sex: "Male", id: 1},
    {name: "Tae", sex: "Male", id: 2},
    {name: "Aek", sex: "Male", id: 3},
    {name: "AUMTERDUM", sex: "Male", id: 4},
=======
const users = [
    {name: "Pluem", sex : "Male",id : "62020932"},
    {name: "LUES", sex: "Male",id : "62020943"},
    {name: "Tae", sex: "Male",id : "62020853"},
    {name: "Aek", sex: "Male",id : "62022901"},
    {name: "AUMTERDUM", sex: "Male",id : "62021067"},
>>>>>>> 0291f0072ce1a02ac793588249d335d712e23295
  ];
const books = [
  { title: "The Lord",UserID: 3,id: 0},
  { title: "The Of",UserID: 2,id: 1},
  { title: "The Ring",UserID: 1,id: 2},
  { title: "The Thai",UserID: 1,id: 3},
];
//schema
const typeDefs = gql`
    type Query {
        hello: String
        hi: String
        users: [User]
        user(name: String): User
    }
    type User {
        name: String
        sex: String
    }
    type Book{
        title : String
    }
    type Mutation {
        addUser(name: String, sex: String): User
    }
`;

//resolver
const resolvers = {
    Query: {
        hello: (parent, args, context, info) => {
            return "World";
        },
        hi: (parent, args, context, info) => {
            return "bye";
        },
        users: (parent, args, context, info) => {
            return user;
        },
        user: (parent, args, context, info) => {
            return user.find( user => user.name === args.name);
        },
        
    },
    Mutation: {
        addUser: (parent, args, context, info) => {
            const {name, sex} = args; // const naem = args.name;

            //add info database
            user.push({name: name, sex: sex});
            return {name: name, sex: sex};
        }
    }
};

//function-apollo-server
const startApolloServer = async (typeDefs,resolvers) =>{
    const server = new ApolloServer({ typeDefs, resolvers});
    const { url } = await server.listen();
    console.log(`Server ready at ${url}`);

};
//call function
startApolloServer(typeDefs, resolvers);
