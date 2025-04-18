const mongoose = require('mongoose');
require('dotenv').config();

async function clearUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop the users collection
    await usersCollection.drop();
    console.log('Users collection dropped successfully');

    // Create new index for email
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('New email index created successfully');

    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

clearUsers(); 