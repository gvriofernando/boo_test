const Profile = require('../../core/profile/Profile');
const mongoDBConnector = require('../mongoDBConnector');
// const { ObjectId } = require('mongodb');

class MongoDBProfileRepository {
    constructor() {
        this.client = mongoDBConnector.getClient();
        this.db = mongoDBConnector.getDatabase();
    }

    async createProfile(profileData) {
        const profile = new Profile(profileData);
        
        try {
            const collection = this.db.collection('profiles');
            const result = await collection.insertOne(profile);
            console.log(`Profile saved to MongoDB with ID: ${result.insertedId}`);
            return profile;
        } catch (error) {
            console.error('Error saving profile to MongoDB:', error);
            throw error;
        }
    }

    async getProfileById(profileId) {
        try {
            const collection = this.db.collection('profiles');
            const profileData = await collection.findOne({ id: parseInt(profileId, 10) });
            if (!profileData) {
                return null; 
            }
    
            return new Profile(profileData);
        } catch (error) {
            console.error('Error getting profile by ID:', error);
            throw error;
        }
    }
}

module.exports = MongoDBProfileRepository;