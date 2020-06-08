const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const staple = require("staple-api");
const ontology = {
    file: "./docs/ontology.ttl"
};

const config = {
    dataSources: {
        default: "defaultSource",
        defaultSource: {
            type: "mongodb",
            url: "mongodb+srv://read_only:9SSHSnNBqJONIHFE@knowledgify-ybkbd.gcp.mongodb.net/test",
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

    // creating the list of all artists' names for FE indexing
    let musicGroups = []

    console.log("Fetching artists' names...")
    await stapleApi.graphql('{ MusicGroup { _id name } }').then((response) => {
        response.data.MusicGroup.forEach(element => {
            musicGroups.push({id: element._id, text:element.name})
        });
        console.log("...all fetched!")
        });

    // exnabling FE, Staple API and people endpoint via express server

    const app = express();

    app.get('/music', function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(musicGroups)
      })
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
