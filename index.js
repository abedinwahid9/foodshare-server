const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.os721gq.mongodb.net/?retryWrites=true&w=majority`;

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
    const foodCollection = client.db("foodDB").collection("foodCollection");
    const foodReqCollection = client
      .db("foodDB")
      .collection("foodReqCollection");

    app.get("/foods", async (req, res) => {
      const cursor = await foodCollection.find();

      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/foods/update/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    app.get("/reqfood/:email", async (req, res) => {
      const email = req.params.email;
      let query = { email: email };

      const cursor = await foodReqCollection.find(query);

      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/reqfood", async (req, res) => {
      console.log(req.query);

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email, id: req.query.sort };
      }

      const cursor = await foodReqCollection.find(query);

      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/foods/details/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await foodCollection.findOne(query);

      res.send(result);
    });

    app.get("/foods/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email: email };

      const cursor = await foodCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    app.post("/addfood", async (req, res) => {
      const newFood = req.body;

      console.log(newFood);

      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    });

    app.post("/reqfood", async (req, res) => {
      const newFood = req.body;

      console.log(newFood);

      const result = await foodReqCollection.insertOne(newFood);
      res.send(result);
    });

    app.put("/foods/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateFood = req.body;

      const cart = {
        $set: {
          foodName: updateFood.foodName,
          Foodimageurl: updateFood.Foodimageurl,
          FoodQuantity: updateFood.FoodQuantity,
          ExpiredDate: updateFood.ExpiredDate,
          Pickuplocation: updateFood.Pickuplocation,
          AdditionalNotes: updateFood.AdditionalNotes,
        },
      };

      const result = await foodCollection.updateOne(filter, cart, options);

      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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
  res.send("food Community server running");
});

app.listen(port, () => {
  console.log("server is running and port", port);
});
