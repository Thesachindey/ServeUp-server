const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require("dotenv").config()
const app = express()
const port = 3000
// -------------------
app.use(express.json())
app.use(cors())
//--------------

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6fqewb1.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // --------------- start from here----------------
        //database connection
        const db = client.db('events-db')
        const eventsCollection = db.collection('events')
        
        //-------------------
        //database theke data niye asbo, data manipulate korbo, data add korbo, by api methods

        //GET all events data [find().toArray(), findOne().toArray()] by using GET api methods
        app.get('/events', async (req, res) => {
            //step1: database (eventsCollection) theke data niye asbo 
            const result = await eventsCollection.find().toArray()
            //step2: data ke client k pathabo
            res.send(result)
        })

// details page er jonno specific data niye asbo by id
app.get('/events/:id', async(req,res)=>{
    // step1: id ke niye asbo from clint
    const id= req.params.id;
})


        //POST api method use kore data servere anbo and mongo db te add korbo [insertMany(), insertOne()] method diye.

        app.post('/events', async (req, res) => {
            // step1: client theke data niye asbo
            const newEvent = req.body;
            console.log(newEvent)
            // step2: oi data ke database (eventsCollection) te add korbo
            const result = await eventsCollection.insertOne(newEvent)

            // step3: database theke result ke client k pathabo
            res.send(result)
        })









        //----------------
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// --------------

app.get('/', (req, res) => {
    res.send('The events data base running well!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
