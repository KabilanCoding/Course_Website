const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'yourDatabaseName';
const collectionName = 'users';

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ username, password });

        if (user) {
            res.status(200).send('Login successful!');
        } else {
            res.status(401).send('Invalid username or password. Please try again.');
        }

        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to handle sign-in
app.post('/signin', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Check if the username already exists
        const existingUser = await collection.findOne({ username });

        if (existingUser) {
            res.status(400).send('Username already exists. Please choose a different username.');
            return;
        }

        // Insert the new user
        const result = await collection.insertOne({ username, email, password });
        console.log('User signed in:', result.insertedId);

        res.status(200).send('Sign-in successful!');

        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
