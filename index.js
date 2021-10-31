const express = require('express')
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m9exe.mongodb.net/NexusTravels?retryWrites=true&w=majority`;
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
try{
  await client.connect();
  const database = client.db('NexusTravels');
  const tourCollection = database.collection ('tours');
  const myTourCollection = database.collection ('tour');

  console.log ('connected');
    // Tour Services
    app.get('/tours', async (req, res) => {
      const cursor = tourCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
  });

  //Get Single Tour Service
  
  
  app.get('/tours/:id', async(req, res)=>{
    const id  = req.params.id;
    const query = {_id:objectId(id)};
    const tour = await tourCollection.findOne(query);
    res.json(tour);
});

// Add Tour Services

app.post('/tours', async (req, res) => {
  const tour = req.body;
  const result = await tourCollection.insertOne(tour);
  console.log(result);
  res.json(result);
});

//Get my orders
app.get('/tour', async (req, res) => {
  const cursor = myTourCollection.find({});
  const tours = await cursor.toArray();
  res.send(tours);
});

//Add my tour orders
app.post('/tour', async (req, res) => {
  const myTour = req.body;
  const result = await myTourCollection.insertOne(myTour);
  console.log(result);
  res.json(result);
});
//handle my orders
app.delete('/tour/:id', async(req, res) => {
  const id  = req.params.id;
  const query ={_id:objectId(id)};
  const result = await myTourCollection.deleteOne(query);
  res.json(result);
})
// Delete Tour Services

  app.delete('/tours/:id', async(req, res) => {
    const id  = req.params.id;
    const query ={_id:objectId(id)};
    const result = await tourCollection.deleteOne(query);
    res.json(result);
})



}
finally{
    //await client.close
}
}
run().catch (console.dir);


app.get('/', (req, res) => {
  res.send('Running Nexus Server!')
})

app.listen(port, () => {
  console.log(`Running Nexus Server!`)
})


