const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const joinedEventsCollection = db.collection('joined-events')

        //-------------------
        //database theke data niye asbo, data manipulate korbo, data add korbo, by api methods

        //GET all events data [find().toArray(), findOne().toArray()] by using GET api methods
        //we can check GET api data by browser directly
        app.get('/events', async (req, res) => {
            //step1: database (eventsCollection) theke data niye asbo 
            const result = await eventsCollection.find().toArray()
            //step2: data ke client k pathabo
            res.send(result)
        })

        // details page er jonno specific data niye asbo by id
        app.get('/events/:id', async (req, res) => {
            //step1: url theke id ta niye asbo
            const { id } = req.params
            console.log(id)
            //step2: database (eventsCollection) theke specific data niye asbo 
            const result = await eventsCollection.findOne({ _id: new ObjectId(id) })
            //step3: data ke client k pathabo
            res.send(result)
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

        // joined events page er jonno 
        app.post('/joined-events', async (req, res) => {
            const joinedEventData = req.body;
            console.log(joinedEventData)
            const result = await joinedEventsCollection.insertOne(joinedEventData)
            res.send(result)
        })

        app.get("/joined-events/check", async (req, res) => {
            const { eventId, email } = req.query;

            const exists = await joinedEventsCollection.findOne({
                eventId: eventId,
                userEmail: email,
            });
            res.send({ joined: !!exists });
        });

        // ---------------
        app.get('/joined-events', async (req, res) => {
            //step1: database (joinedEventsCollection) theke data niye asbo 
            const result = await joinedEventsCollection.find().sort({ eventDate: "desc" }).toArray();
            //step2: data ke client k pathabo
            res.send(result)
        })

        //----------------for my joined events page----------------
        app.get("/my-joined-events", async (req, res) => {
            const email = req.query.email
            const result = await joinedEventsCollection.find({ userEmail: email }).sort({ eventDate: "desc" }).toArray()
            res.send(result)
        }
        )
//----------------------for cancel joined event----------------
        app.delete("/joined-events/:id", async (req, res) => {
            const { id } = req.params;
            const result = await joinedEventsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send({
                success: true,
                result,
            });
        });
//------------------for manage my created events page---------------


    app.get("/my-events", async (req, res) => {
            const email = req.query.email
            const result = await eventsCollection.find({ createdBy: email }).toArray()
            res.send(result)
        })



//---------for update event page----------------
 app.put("/events/:id", async (req, res) => {
            const { id } = req.params;
            const data = req.body;
            // console.log(id)
            // console.log(data)
            const objectId = new ObjectId(id);
            const filter = { _id: objectId };
            const update = {
                $set: data,
            };

            const result = await eventsCollection.updateOne(filter, update);
            res.send({
                success: true,
                result,
            });
        });
        //----------------for delete event----------------
        app.delete("/events/:id", async (req, res) => {
            const { id } = req.params;
            const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send({
                success: true,
                result,
            });
        });







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
