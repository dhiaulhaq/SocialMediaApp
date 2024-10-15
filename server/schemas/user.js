const { ObjectId } = require('mongodb');
const { GraphQLError } = require("graphql");
const User = require('../models/User');

// const users = [
//     {
//         id: 1,
//         name: "Leanne Graham",
//         username: "Bret",
//         password: "123456",
//         email: "halo@mail.com",
//     },
//     {
//         id: 2,
//         name: "Ervin Howell",
//         username: "Antonette",
//         password: "123456",
//         email: "admin@mail.com",
//     },
//     {
//         id: 3,
//         name: "Clementine Bauch",
//         username: "Samantha",
//         password: "123456",
//         email: "other@mail.com",
//     },
// ];

const userTypeDefs = `#graphql
type User {
    _id: ID!
    name: String
    username: String!
    email: String!
    password: String!
}

input UserCreateInput {
    name: String
    username: String!
    email: String!
    password: String!
}

type Query{
    #Learning
    userByEmail(email: String!): UserResponse

    #Real deal
    userSearch(name: String!): UserResponse

    userFetchAll: [User]
}

type Mutation{
    #Learning
    userDelete(id: ID!): UserMutationResponse

    #Real deal
    userLogin(username: String!, password: String!): UserLoginResponse

    userCreate(input: UserCreateInput): UserMutationResponse

}
`;

const userResolvers = {
    Query: {
        userByEmail: (_, args) => {
            const { email } = args;
            const user = users.find((user) => user.email === email);

            return {
                statusCode: 200,
                data: user,
            }
        },
    },

    Mutation: {
        userLogin: (_, args) => {
            const { username, password } = args;

            const user = users.find((user) => user.username === username && user.password === password);

            if (!user) {
                throw new GraphQLError('Invalid username or password', {
                    extensions: {
                        http: {
                            status: 401,
                        },
                    },
                });
            }

            return {
                statusCode: 200,
                data: {
                    token: "imagine-a-token",
                },
            };
        },

        userCreate: async (_, args) => {
            const { input } = args;
            const user = await User.insertOne(input);
            return {
                statusCode: 200,
                message: user.message,
            };
        },

        userDelete: (_, args, contextValue) => {
            const { id } = args;
            contextValue.dummyFunction();
            users = users.filter((user) => user.id !== Number(id));

            return {
                statusCode: 200,
                message: `User with id ${id} deleted successfully`,
            };
        },

    },
};

module.exports = { userTypeDefs, userResolvers };