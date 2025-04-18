const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop all indexes
    await usersCollection.dropIndexes();
    console.log('All indexes dropped successfully');

    // Create new index for email
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('New email index created successfully');

    console.log('Index fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes(); 