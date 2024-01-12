const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MongoDBVotingCommentRepository = require('../../adapters/voting-comment/MongoDBVotingCommentRepository');

let connection;
let db;
let mongoServer;

beforeAll(async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        connection = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = connection.db();
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        if (connection) {
            await connection.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    } catch (error) {
        console.error('Error in afterAll:', error);
        throw error;
    }
});

describe('MongoDBVotingCommentRepository', () => {
    const repository = new MongoDBVotingCommentRepository();

    afterEach(async () => {
        await db.collection('votingComments').deleteMany({});
        await db.collection('userVotes').deleteMany({});
    });

    test('createVotingComment should insert a new voting comment', async () => {
        const votingComment = { targetProfile: 1, createdDate: new Date('2022-01-01'), total_like: 10 };
        const insertedId = await repository.createVotingComment(votingComment);

        expect(insertedId).toBeDefined();
        const insertedObjectId = new ObjectId(insertedId);
        const insertedComment = await db.collection('votingComments').findOne({ _id: insertedObjectId });
        expect(insertedComment).toMatchObject(votingComment);
    });

    test('getVotingCommentsByTargetProfile should retrieve voting comments', async () => {
        const targetProfileId = 'profile123';
        const votingComments = [
            { targetProfile: targetProfileId, createdDate: new Date('2022-01-01'), total_like: 10 },
            { targetProfile: targetProfileId, createdDate: new Date('2022-01-02'), total_like: 5 },
        ];
        await db.collection('votingComments').insertMany(votingComments);

        const filter = '';
        const sort = 'recent';

        const result = await repository.getVotingCommentsByTargetProfile(targetProfileId, filter, sort);
        expect(result).toHaveLength(votingComments.length);
    });

    test('likeDislikeVotingComment should update total likes/dislikes', async () => {
        const votingComment = { total_like: 5 };
        const { insertedId } = await db.collection('votingComments').insertOne(votingComment);

        const action = 'like';
        const updatedComment = await repository.likeDislikeVotingComment(insertedId._id, action);

        expect(updatedComment.total_like).toBe(votingComment.total_like + 1);
    });

    test('updateUserVote should add or remove user vote', async () => {
        // Insert test data
        const userId = '1';
        const votingCommentId = 1;
        await db.collection('userVotes').insertOne({ userId, votingCommentId });

        // User has already voted (like), attempting to like again should throw an error
        await expect(repository.updateUserVote(userId, votingCommentId, 'like')).rejects.toThrow();

        // Disliking the voting comment (record should be removed)
        await repository.updateUserVote(userId, votingCommentId, 'dislike');

        const userVote = await db.collection('userVotes').findOne({ userId, votingCommentId });
        expect(userVote).toBeNull();
    });
});