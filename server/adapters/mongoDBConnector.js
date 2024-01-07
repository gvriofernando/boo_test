const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

const dbName = 'admin';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function disconnectFromMongo() {
    try {
        await client.close();
        console.log('Connection to MongoDB closed');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}

module.exports = {
    connectToMongo,
    disconnectFromMongo,
    getClient: () => client,
    getDatabase: () => client.db(dbName),
};