const mongoose = require('mongoose');
require('dotenv').config();

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get the database
    const db = mongoose.connection.db;

    // Drop all collections
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`Dropped collection: ${collection.name}`);
    }

    console.log('Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase(); 