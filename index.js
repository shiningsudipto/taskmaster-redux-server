
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json("TaskMaster is running")
})

const uri = "mongodb+srv://taskMaster:ZQJh5ibUsQuJxnhU@cluster0.kh5m3gl.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();
        // Send a ping to confirm a successful connection

        const tasksCollection = client.db('taskMaster').collection('tasks');

        // getting all tasks
        app.get('/allTasks', async (req, res) => {
            const tasks = await tasksCollection.find().toArray();
            res.json(tasks);
        });

        app.post('/addTask', async (req, res) => {
            const newTask = req.body;
            const result = await tasksCollection.insertOne(newTask);
            res.json(result);
        })

        app.patch('/taskStatus/:id', async (req, res) => {
            const taskId = req.params.id;
            const updateTaskData = req.body;
            const result = await tasksCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $set: updateTaskData }
            );
            res.json(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})