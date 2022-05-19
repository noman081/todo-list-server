const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v6azo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todo').collection('taskList');

        app.post('/todo', async (req, res) => {
            const task = req.body;
            const result = await todoCollection.insertOne(task);
            res.send(result);
        })
        app.get('/todo', async (req, res) => {
            const result = await todoCollection.find().toArray();
            res.send(result);
        });
        app.get('/todo/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const todos = await todoCollection.find(filter).toArray();
            res.send(todos);
        });
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const complete = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: complete,
            };
            const result = await todoCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Todo server is running..........');
})

app.listen(port, () => {
    console.log('Todo is running on port- ', port);
})