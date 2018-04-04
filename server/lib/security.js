var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:3001/";

function connect(callback)
{
    MongoClient.connect(url, function (err, db) {
        if (err) return callback(err);
        else
        {
            if(!db) return callback("Connect failed");
            return callback(null,db);
        }
    });
}

