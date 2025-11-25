const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        // Connect the client to the server
        await client.connect();
        await client.db("admin").command({ ping: 1 });
         const Itemscollection = client.db('homeNest').collection('items');
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.post('/items', async (req, res) => {
            const newItem = req.body;
           
        }

    }

    finally {
        // Ensures that the client will close when you finish
        await client.close();

    }
}

//simple test route
app.get('/', (req, res) => {
    res.send('React Server is running');
});


run().catch(console.dir);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});