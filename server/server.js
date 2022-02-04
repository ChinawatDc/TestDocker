//import { ApolloServer, gql } from 'apollo-server';
import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import expressJWT from 'express-jwt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getOperationAST } from 'graphql';
import pg from 'pg/native'
// const { Pool } = require('pg')

const users = [
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
            return users;
        },
        user: (parent, args, context, info) => {
            return users.find( user => user.name === args.name);
        },
        
    },
    User:{
        books: ({id}, args, context, info)=> {
            if(!getPermission(user, 'admin'))
            return books.filter(book => book.UserID == id);
        },
        locations: ({id}, args, context, info) => {
            return locations.filter(location => location.UserID == id);
        },
    },
    Mutation: {
        addUser: (parent, args, /*context*/ { user }, info) => {
            // const user = context.user;
            // if(getPermis(user)) return new Error("not permisstion");
            const {name, sex} = args; // const naem = args.name;

            //add info database
            users.push({name: name, sex: sex});
            return {name: name, sex: sex};
        },
        createUser: (parent, args, context, info) => {
            const {name, password}=args;
            const hashPassword = bcrypt.hashSync(password, 10);
            users.push({name: name, password: hashPassword});
            return {name: name, password: hashPassword};
        },
        loginUser: async (parent, args, context) => {
            
            const user = users.filter(user => user.name === args.name)[0];
            // const correct = bcrypt.compareSync(user.password, args.password);
            //console.log(`User: ${JSON.stringify(user)}`);
            const correct = await bcrypt.compare(args.password, user.password);
            //console.log(`Status: ${correct}`)
             if(correct){
                const token = jwt.sign({ "user": user.name }, "secrets", {algorithm: 'HS256'});
                 return token;
             }
            return "Not Correct";
        }
    }
};
//function-apollo-server
const startApolloServer = async (typeDefs,resolvers) =>{
    //const server = new ApolloServer({ typeDefs, resolvers});
    const post = 4000;
    const app = express();
     app.use(
         //{ "Authorization": "Bearer <jwt token>"}
         expressJWT({
             secret: "secrets",
             algorithms: ["HS256"],
             credentialsRequired: false
         })
     );
    const httpServer = http.createServer(app);
     const server = new ApolloServer({
         typeDefs,
         resolvers,
          context: ({req}) => {
            if(req.headers.authorization){
                //console.log(`req:${JSON.stringify(req)}`);
                //const user = req.user || null;
                //   console.log(`req.user: ${user}`);
                const token = req.headers.authorization.split(' ')[1];
                console.log('token: ${token}')
                const user = jwt.verify(token, 'secrets');
                return {user}; 
            }
            return null;
          },
         plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    const pool = new Pool({
        user: 'postgres',
        host: 'db',
        database: 'docker',
        password: 'example'
    })
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    });
    //const { url } = await server.listen();
    //console.log(`Server ready at ${url}`);

};
//call function
startApolloServer(typeDefs, resolvers);
