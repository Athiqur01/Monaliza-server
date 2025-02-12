const express=require('express');
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT||5018;
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnncxar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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

    const itemsCollection = client.db("itemsDB").collection('items');
    const userCollection = client.db("itemsDB").collection('user');

    app.get('/items', async (req,res)=>{
        const cursor=itemsCollection.find();
        const result=await cursor.toArray()
        res.send(result)
    })

    app.get('/items/:id', async (req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        const item= await itemsCollection.findOne(quary) 
        res.send(item)
    })

    app.put('/items/:id', async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const newItem=req.body;
      const Item={
        $set:{
          itemName:newItem.itemName,
          imageUrl:newItem.imageUrl,
          subcatagory:newItem.subcatagory,
          itemDescription:newItem.itemDescription,
          price:newItem.price,
          rating:newItem.rating,
          customization:newItem.customization,
          processingTime:newItem.processingTime,
          stockStatus:newItem.stockStatus,
          email:newItem.email,
          userName:newItem.userName
        }
        
      }
      const result=await itemsCollection.updateOne(filter,Item,options)
      res.send(result)
      

    })
    

    app.post("/items", async (req,res)=>{
        const newItems=req.body
        
        const result= await itemsCollection.insertOne(newItems) 
        res.send(result)
    })

    app.delete('/items/:id', async (req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        const item= await itemsCollection.deleteOne(quary) 
        res.send(item)
    })

    app.get('/user', async (req,res)=>{
        const cursor=userCollection.find();
        const result=await cursor.toArray()
        res.send(result)
    })


    app.post("/user", async (req,res)=>{
        const userInfo=req.body
        
        const result= await userCollection.insertOne(userInfo) 
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






app.get('/',(req,res)=>{
    res.send('Monaliza server is running')
})
app.listen(port,()=>{
    console.log(`Site is running on port ${port}`)
})