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
        const submissions = client.db("submissions").collection("submissions");


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

        app.patch('/users/:id/solved-problems', async (req, res) => {
            const { solvedProblem } = req.body;
            const id = req.params.id;

            try {
                const result = await users.updateOne(
                    { _id: new ObjectId(id) },
                    { $push: { solvedProblems: solvedProblem } },
                );

                if (result.modifiedCount > 0) {
                    res.send({ message: 'Solved problem added successfully!' });
                } else {
                    res.send({ message: 'No user found with the provided ID.' });
                }
            } catch (error) {
                res.status(500).send({ message: 'An error occurred.', error });
            }
        })

        // app.patch('/users/:id/solved-problems', async (req, res) => {
        //     const { solvedProblem } = req.body;
        //     const id = req.params.id;
        
        //     try {
        //         // Check if the user exists
        //         const user = await users.findOne({ _id: new ObjectId(id) });
        
        //         if (!user) {
        //             return res.status(404).send({ message: 'No user found with the provided ID.' });
        //         }
        
        //         // Check if the problem already exists in the solvedProblems array
        //         const problemExists = user.solvedProblems.some(
        //             (problem) => problem.title === solvedProblem.title
        //         );
        
        //         if (problemExists) {
        //             return res.status(400).send({ message: 'This problem has already been solved by the user.' });
        //         }
        
        //         // Push the new solved problem into the array
        //         const result = await users.updateOne(
        //             { _id: new ObjectId(id) },
        //             { $push: { solvedProblems: solvedProblem } }
        //         );
        
        //         if (result.modifiedCount > 0) {
        //             res.send({ message: 'Solved problem added successfully!' });
        //         } else {
        //             res.send({ message: 'No user found with the provided ID.' });
        //         }
        //     } catch (error) {
        //         console.error('Error occurred during the update:', error);
        //         res.status(500).send({ message: 'An error occurred.', error: error.message });
        //     }
        // });
        

        
        app.get('/users/:id/solved-problems', async (req, res) => {

        })

        // app.post('/users/:id/submissions', async (req, res) => {
        //     const id = req.params.id;
        //     const { submission } = req.body;
        //     const result = await submissions.insertOne(submission);
        //     res.send(result);
        // })

        // app.get('/users/:id/submissions', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) };
        //     const all = await submissions.find(filter).toArray();
        //     res.send(all);
        // })


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
            const all = await users.find().toArray();
            res.send(all);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const all = await users.findOne(filter);
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