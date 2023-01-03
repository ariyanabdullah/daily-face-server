const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// ===connection database===

const uri =
  'mongodb+srv://Facebook_web:gjGjTEaE6BQ4bYNB@cluster0.lcft2gb.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const facebookUser = client.db('facebook').collection('users')
    const postCollection = client.db('facebook').collection('userPost')
    const commentCollection = client.db('facebook').collection('comment')
    const addCollection = client.db('facebook').collection('add')

    app.get('/', async (req, res) => {
      res.send('facebook server is runniung')
    })

    // ===create user
    app.post('/user', async (req, res) => {
      const user = req.body
      const result = await facebookUser.insertOne(user)
      res.send(result)
    })

    // ====get user====
    app.get('/alluser', async (req, res) => {
      const query = {}
      const result = await facebookUser.find(query).toArray()
      res.send(result)
    })

    // ===Updet User ===
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id
      const user = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
          city: user.city,
          education: user.education,
        },
      }
      const result = await facebookUser.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    //   ===User post ===
    app.post('/userPost', async (req, res) => {
      const body = req.body
      const result = await postCollection.insertOne(body)
      res.send(result)
    })

    // === get user data===
    app.get('/postData', async (req, res) => {
      const query = {}
      const result = await postCollection.find(query).toArray()
      res.send(result)
    })

    // ===handle Liked====
    app.put('/like/:id', async (req, res) => {
      const id = req.params.id
      const body = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
       const updateDoc = {
         $set: {           
             postLike: body.like
         }
       }
       const result = await postCollection.updateOne(filter, updateDoc, options)
       res.send(result)
    })

    // ==== Comment Post ===
    app.post('/comments', async(req, res) => {
      const comment = req.body
      const result = await commentCollection.insertOne(comment)
      res.send(result)
    })


    // === get Comment ===
    app.get('/allComment/:id', async(req, res) =>{
      const id = req.params.id
      const query = {postId : id}
      const result = await commentCollection.find(query).toArray()
      res.send(result)
    })


    // ===post add ===
    app.post('/add', async(req, res) =>{
      const add = req.body
      const result = await addCollection.insertOne(add)
      res.send(result)
    })

    // ===get add===
    app.get('/alladd', async(req, res)=>{
      const query ={}
      const result = await addCollection.find(query).toArray()
      res.send(result)
    })



  } finally {
  }
}
run().catch((err) => {
  console.log(err.name, err.message)
})

app.listen(port, () => {
  console.log(`server start on port ${port}`)
})

// gjGjTEaE6BQ4bYNB
// Facebook_web
