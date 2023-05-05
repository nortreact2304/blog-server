const postsDatabase = 'posts-data'

async function insertPost(dbClient, post) {
    let result
    try {
        dbClient.connect()
        const database = dbClient.db(postsDatabase)
        const posts = database.collection('posts')
        result = await posts.insertOne(post)
    } catch (err) {
        result = {
            error: err.message
        }
    } finally {
        dbClient.close()
    }
    return result
}
async function readPosts(dbClient) {
    let result
    try {
        dbClient.connect()
        const database = dbClient.db(postsDatabase)
        const posts = database.collection('posts')
        result = await posts.find({}).toArray()
        result = result.map((p) => {
            return {
                id: p._id,
                title: p.title,
                annotation: p.annotation,
                content: p.content,
                piccUrl: p.piccUrl
            }
        })
    } catch (err) {
        result = {
            error: err.message
        }
    } finally {
        dbClient.close()
    }
    return result
}

module.exports = {
    insertPost,
    readPosts
}