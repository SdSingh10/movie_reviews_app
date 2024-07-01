import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from './dao/moviesDAO.js'

async function main(){
    dotenv.config()
    
    console.log('MOVIEREVIEWS_DB_URI:', process.env.MOVIEREVIEWS_DB_URI);
    console.log('PORT:', process.env.PORT);

    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI
    )
    const port = process.env.PORT || 8000

    try{
        await client.connect()
        await MoviesDAO.injectDB(client)

        console.log('Connected to MongoDB successfully.');

        app.listen(port, () =>{
            console.log('server is running on port: ' + port);
        })
    } catch(e) {
        console.error(e)
        process.exit(1)
    }
}
main().catch(console.error);