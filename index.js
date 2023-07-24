const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8grpiox.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const collegeCollection = client.db("EduHubDB").collection("colleges");
    const researchCollection = client.db("EduHubDB").collection("journals");
    const reviewsCollection = client.db("EduHubDB").collection("reviews");
    const admissionCollection = client
      .db("EduHubDB")
      .collection("admissionInfo");

    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    app.get("/journals", async (req, res) => {
      const result = await researchCollection.find().toArray();
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    app.post("/admissions", async (req, res) => {
      const items = req.body;
      console.log(items);
      const result = await admissionCollection.insertOne(items);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const items = req.body;
      console.log(items);
      const result = await reviewsCollection.insertOne(items);
      res.send(result);
    });

    app.get("/myadmission", async (req, res) => {
      const email = req.query;
      const query = { user_email: email.email };
      console.log(query);
      const result = await admissionCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EduHub Server is Running");
});

app.listen(port, () => {
  console.log(`EduHub Server running on port: ${port}`);
});
