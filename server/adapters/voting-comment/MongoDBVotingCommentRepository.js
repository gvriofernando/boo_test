const mongoDBConnector = require('../mongoDBConnector');
const { ObjectId } = require('mongodb');

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

    async likeDislikeVotingComment(votingCommentId, action) {
        try {
            const collection = this.db.collection('votingComments');
            const votingCommentObjectId = new ObjectId(votingCommentId);
            const updateValue = action === 'like' ? 1 : action === 'dislike' ? -1 : 0;
    
            await collection.updateOne(
                { _id: votingCommentObjectId },
                { $inc: { total_like: updateValue } }
            );
    
            const updatedVotingComment = await collection.findOne({ _id: votingCommentObjectId });
            return updatedVotingComment;
        } catch (error) {
            console.error('Error updating VotingComment:', error);
            throw error;
        }
    }

    async updateUserVote(userId, votingCommentId, action) {
        try {
            const collection = this.db.collection('userVotes');
    
            const existingVote = await collection.findOne({
                userId: userId,
                votingCommentId: new ObjectId(votingCommentId),
            });
    
            if (existingVote) {
                // User has already voted, throw an error for 'like' action
                if (action === 'like') {
                    throw new Error('User has already liked this voting comment');
                }

                // For 'dislike' action, record already exists, no need to add a new one
                await collection.deleteOne({
                    userId: userId,
                    votingCommentId: new ObjectId(votingCommentId),
                });
            } else {
                // Add a new user vote entry for 'like'
                if (action === 'dislike') {
                    throw new Error('User cannot dislike a voting comment that has not been liked');
                } 

                await collection.insertOne({
                    userId: userId,
                    votingCommentId: new ObjectId(votingCommentId),
                });
            }
            return true; 
        } catch (error) {
            console.error('Error adding user vote:', error);
            throw error;
        }
    }
}

module.exports = MongoDBVotingCommentRepository;