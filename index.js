const express = require('express');
const app = express();
// require('dotenv').config();   
const port = process.env.PORT || 5000;
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { default: axios } = require('axios');
const uri = "mongodb+srv://saadealif2010:4bQc9AnNWTQUiOFr@cluster0.uuynk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }
});

async function run() {
    try {

        // await client.connect();

        const maths = client.db("maths").collection("maths");
        const contests = client.db("contest").collection("contests");
        const users = client.db("users").collection("users");
        const leaderboard = client.db("leaderboard").collection("leaderboard");


        app.get('/contests', async (req, res) => {
            const all = await contests.find().toArray();
            res.send(all);
        })
        app.get('/math', async (req, res) => {
            const all = await maths.find().toArray();
            res.send(all);
        })
        app.post('/math', async (req, res) => {
            const data = req.body;
            const result = await maths.insertOne(data);

            res.send(result);
        })
        app.post('/users', async (req, res) => {
            const user = req.body;


            const allUsers = await users.find().toArray();
            for (let i = 0; i < allUsers.length; i++) {
                if (allUsers[i].email === user.email) {
                    return res.send({ message: 'User already exists!' });
                }
            }
            const result = await users.insertOne(user);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const all = users.find().toArray();
            res.send(all);
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // console.log('just do nothing')
        // succesfully deployed
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('pie sqaured got wrong !!');
})
app.get('/a', (req, res) => {
    res.send('pie^a sqaured got wrong !!');
})

app.listen(port, (req, res) => {
    console.log(`server runnign on port : ${port}`);
})