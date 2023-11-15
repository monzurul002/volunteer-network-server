
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors")
app.use(cors())
app.use(express.json())
require("dotenv").config()
//cloudinary
const cloudinary = require('cloudinary').v2;


//multer 
const multer = require('multer')
// const upload = multer()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//  const upload = multer({ dest: './uploads' })
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });




cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key: `${process.env.API_KEY}`,
    api_secret: `${process.env.API_SECRET}`
});


// cloudinary.config({
//     cloud_name: 'dj7z2d6lv',
//     api_key: '775228647313376',
//     api_secret: 'kv06GEzPWW0OVgMhZYj8S7VuWGg'
// });
console.log(`${process.env.DB_USER}`);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority`;

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

        const volunteersCollections = client.db("volunteerDb").collection("volunteer");
        const eventsCollection = client.db('volunteerDb').collection("events")

        app.get("/volunteers", async (req, res) => {
            const result = await volunteersCollections.find().toArray();
            res.send(result)
        })

        app.post('/profile', upload.single('image'), async (req, res) => {
            try {
                const imagePath = req.file?.path;
                const { title, description, date } = req.body;
                const result = await cloudinary.uploader.upload(imagePath);
                // const result = await cloudinary.uploader.upload(imagePath);

                if (result.asset_id) {
                    const imageUrl = result.url;
                    const eventInfo = {
                        title,
                        description,
                        date,
                        imageUrl
                    };
                    const insertResult = await eventsCollection.insertOne(eventInfo);
                    res.send(insertResult); // Send the response after successful insertion
                } else {
                    res.send('Image upload failed');
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Error processing request');
            }
        });
        app.get("/volunteersList", async (req, res) => {
            const result = await eventsCollection.find().toArray();
            res.send(result)
        })
        app.delete("/events", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await eventsCollection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("HELLO VOLUNTEERS")
})


app.listen(port, () => {
    console.log("server is running");
})



