// tests/profile/MongoDBProfileRepository.test.js
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MongoDBProfileRepository = require('../../adapters/profile/MongoDBProfileRepository');
const Profile = require('../../core/profile/Profile');

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

describe('MongoDBProfileRepository', () => {
    const repository = new MongoDBProfileRepository();

    afterEach(async () => {
        await db.collection('profiles').deleteMany({});
    });

    test('createProfile should save a profile to MongoDB', async () => {
        const profileData = {
            id: 1,
            name: 'John Doe',
            description: 'A fictional character',
            mbti: 'INFJ',
            enneagram: '5w4',
            variant: 'sp/so',
            tritype: 725,
            socionics: 'SEE',
            sloan: 'RCOEN',
            psyche: 'FEVL',
            image: 'https://soulverse.boo.world/images/1.png',
        };

        const createdProfile = await repository.createProfile(profileData);

        expect(createdProfile).toBeInstanceOf(Profile);
        expect(createdProfile.id).toBe(1);

        // Check if the profile is saved in MongoDB
        const savedProfile = await db.collection('profiles').findOne({ id: 1 });
        expect(savedProfile).toBeDefined();
    });

    test('getProfileById should retrieve a profile from MongoDB by ID', async () => {
        const profileData = {
            id: 2,
            name: 'Jane Doe',
            description: 'Another fictional character',
            mbti: 'INTP',
            enneagram: '4w5',
            variant: 'sx/so',
            tritype: 514,
            socionics: 'LII',
            sloan: 'RLOEI',
            psyche: 'NTWI',
            image: 'https://soulverse.boo.world/images/2.png',
        };
        const createdProfile = await repository.createProfile(profileData);
        await db.collection('profiles').insertOne(profileData);

        const retrievedProfile = await repository.getProfileById(2);

        expect(retrievedProfile).toBeInstanceOf(Profile);
        expect(retrievedProfile.id).toBe(2);
        expect(retrievedProfile.name).toBe('Jane Doe');
    });

    test('getProfileById should return null for non-existing profile', async () => {
        const nonExistingProfile = await repository.getProfileById(999);

        expect(nonExistingProfile).toBeNull();
    });
});
