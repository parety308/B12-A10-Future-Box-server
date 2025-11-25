const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvbrfkh.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db('homeNest');
        const Itemscollection = db.collection('items');
        const usersCollection = db.collection('users');
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        //post an item
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await Itemscollection.insertOne(newItem);
            res.send(result);
        });

        //get all items
        app.get('/items', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query["postedBy.email"] = email;
            }
            const cursor = Itemscollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        //get single item
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const item = await Itemscollection.findOne(query);
            res.send(item);
        });

        //get recent items
        app.get('/recent-items', async (req, res) => {
            const cursor = Itemscollection.find().sort({ postedDate: -1 }).limit(6);
            const results = await cursor.toArray();
            res.send(results);
        });

        //add a item
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await Itemscollection.insertOne(newItem);
            res.send(result);
        });


        //update a item
        app.patch('/items/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: updatedItem
            }
            const result = await Itemscollection.updateOne(query, update);
            res.send(result);
        });

        //delete a item
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await Itemscollection.deleteOne(query);
            res.send(result);
        });


    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);


//simple test route
app.get('/', (req, res) => {
    res.send('React Server is running');
});


run().catch(console.dir);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});