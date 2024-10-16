const Follow = require('../models/Follow');

const followTypeDefs = `#graphql
input FollowCreateInput {
    followingId: String!
}

type FollowingResult{
    statusCode: String
    message: String
}

type Mutation {
    followCreate(input: FollowCreateInput): FollowingResult
}
`;

const followResolvers = {
    Mutation: {
        followCreate: async (_, args, context) => {
            const user = await context.authentication();
            const { input } = args;
            const followResult = await Follow.followUser(input, user);

            return {
                statusCode: 200,
                message: followResult
            };
        },

    },
};

module.exports = { followTypeDefs, followResolvers };