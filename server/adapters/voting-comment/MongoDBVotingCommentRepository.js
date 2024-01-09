const mongoDBConnector = require('../mongoDBConnector');
const dbName = 'voting-comment';

class MongoDBVotingCommentRepository {
    constructor() {
        this.client = mongoDBConnector.getClient();
        this.db = mongoDBConnector.getDatabase();
    }

    async createVotingComment(votingComment) {
        try {
            const collection = this.db.collection('votingComments');
            const result = await collection.insertOne(votingComment);
            console.log(`VotingComment inserted with _id: ${result.insertedId}`);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating VotingComment:', error);
            throw error;
        }
    }

    async getVotingCommentsByTargetProfile(targetProfileId, filter, sort) {
        try {
            const collection = this.db.collection('votingComments');
            const filterQuery = { targetProfile: targetProfileId };
            if (filter !== "") {
                filterQuery[filter] = { $ne: "" };
            }
            const sortQuery = sort === "recent" ? { createdDate: -1 } : sort === "best" ? { total_like: -1 } : {};
            const votingComments = await collection.find(filterQuery).sort(sortQuery).toArray();
            return votingComments;
        } catch (error) {
            console.error('Error getting VotingComments by target profile:', error);
            throw error;
        }
    }
}

module.exports = MongoDBVotingCommentRepository;