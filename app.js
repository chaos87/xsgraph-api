if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const staple = require("staple-api");
const cors = require('cors');
const ontology = {
    file: "./docs/ontology.ttl"
};


const config = {
    dataSources: {
        default: "defaultSource",
        defaultSource: {
            type: "mongodb",
            url: "mongodb+srv://"+process.env.MONGO_DB_USER+":"+process.env.MONGO_DB_PASSWORD+"@"+process.env.MONGO_DB_PROJECT+".gcp.mongodb.net/test",
            dbName: "xsilence",
            collectionName: "musicGroups",
            description: "MongoDB Atlas Demo instance"
        }
    }
};

async function Serve() {

    // creating an instance of Staple API

    const stapleApi = await staple(ontology, config);
    const schema = stapleApi.schema;

    const app = express();
    app.use(express.json())
    app.use(cors());

    const server = new ApolloServer({
        schema
    });

    const path = "/graphql";
    server.applyMiddleware({ app, path });

    app.listen({ port: 5000 }, () =>
        console.log("🚀 Server ready")
    );
}

Serve()
