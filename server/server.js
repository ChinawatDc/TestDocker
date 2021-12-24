import { ApolloServer, gql } from 'apollo-server';
import bcrypt from 'bcryptjs';

const user = [
    {name: "Pluem", sex : "Male", id: 0,password: "abc123" },
    {name: "LUES", sex: "Male", id: 1,password: "abc123"},
    {name: "Tae", sex: "Male", id: 2,password: "abc123"},
    {name: "Aek", sex: "Male", id: 3,password: "abc123"},
    {name: "AUMTERDUM", sex: "Male", id: 4,password: "abc123"},
  ];
const books = [
  { title: "The Lord",UserID: 3,id: 0},
  { title: "The Of",UserID: 2,id: 1},
  { title: "The Ring",UserID: 1,id: 2},
  { title: "The Thai",UserID: 0,id: 3},
];
const locations = [
    {address: "143",group: "8", province: "Chiang Rai",UserID: 0,id: 0},
    {address: "20",group: "9", province: "Chiang Rai",UserID: 1,id: 1},
    {address: "13",group: "5", province: "Phayao",UserID: 2,id: 2},
    {address: "29",group: "1", province: "Chai Nat",UserID: 3,id: 3},
    {address: "47",group: "6", province: "Phayao",UserID: 4,id: 4},
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
        id: ID
        name: String
        sex: String
        password: String
        locations: [Location]
        books: [Book]
    }
    type Location{
        id: ID
        address: String
        group: String
        province: String
    }
    type Book{
        id: ID
        title: String
    }
    type Mutation {
        addUser(name: String, sex: String): User
        createUser(name: String, password: String): User
        loginUser(name: String, password: String): String
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
    User:{
        books: ({id}, args, context, info)=> {
            return books.filter(book => book.UserID == id);
        },
        locations: ({id}, args, context, info) => {
            return locations.filter(location => location.UserID == id);
        },
    },
    Mutation: {
        addUser: (parent, args, context, info) => {
            const {name, sex} = args; // const naem = args.name;

            //add info database
            user.push({name: name, sex: sex});
            return {name: name, sex: sex};
        },
        createUser: (parent, args, context, info) => {
            const {name, password}=args;
            const hashPassword = bcrypt.hashSync(password, 10);
            user.push({name: name, password: hashPassword});
            return {name: name, password: hashPassword};
        },
        loginUser:  (parent, args, context) => {
            const user = user.filter(user => user.name === args.name);
            const correct = bcrypt.compareSync(user.password, args.password);
            if(correct){
                return "Correct";
            }
            return "Not Correct";
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
