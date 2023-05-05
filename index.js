const express = require('express')
const path = require('path')
const { MongoClient, ServerApiVersion } = require('mongodb')
const {insertPost, readPosts} = require('./controllers/newsController')
const PORT = process.env.PORT || 8080

const app = express()
//Kataloog public kastuame kõigi avalike failide serveerimiseks
app.use(express.static(path.join(__dirname, 'public')))

//Post päringute sisu parsitakse kui json objektid
app.use(express.json());

const password = 'bWjTWbCVNFO4Ib61'
const account = 'blog-machine'
const uri = `mongodb+srv://${account}:${password}@cluster0.vbolccm.mongodb.net/?retryWrites=true&w=majority`

const dbClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function pingMongoDB() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await dbClient.connect();
      // Send a ping to confirm a successful connection
      await dbClient.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return {
        version: ServerApiVersion.v1,
        message: "Pinged your deployment. You successfully connected to MongoDB!"
      }
    } 
    catch (err) {
        return {
            version: ServerApiVersion.v1,
            error: "Error: " + err.message
          } 
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }


app.get('/', (req, res) => res.send(`
<h1>TODO rakenduse API</h1>
`))

app.get('/api/mongotest', async (req, res) => {
    const result = await pingMongoDB()
    res.json(result)
})

app.post('/api/post', async (req, res) => {
    const newPost = {
        title: req.body.title,
        annotation: req.body.annotation,
        content: req.body.content,
        piccUrl: req.body.piccUrl
    }
    res.json(await insertPost(dbClient, newPost))
})

app.get('/api/post', async (req, res) => {
    res.json(await readPosts(dbClient))
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
