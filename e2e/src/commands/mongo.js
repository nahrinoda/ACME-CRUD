const util = require('util');
const events = require('events');
const MongoClient = require('mongodb').MongoClient;

function Mongo() {
    events.EventEmitter.call(this);
}

util.inherits(Mongo, events.EventEmitter);

Mongo.prototype.command = function (handler, cb) {
    var self = this;

    new Promise((resolve, reject) => {
        MongoClient.connect(self.api.globals.mongo_uri, (err, client) => {
            if (err) {
                console.log('Error connecting to MongoDB');
                reject(err);
            } else {
                console.log('Connected to MongoDB');
                resolve(client);
            }
        });
    }).then((client) => {
        return new Promise((resolve, reject) => {
            resolve(client.db(self.api.globals.mongo_database));
        }).then((db) => handler(db))
        .catch((err) => {
            console.log('An error occurred');
            console.log(err);
        })
        .then(() => {
            client.close();

            if (cb) {
                cb.call(self.client.api);
            }

            self.emit('complete');
        });
    });
    return this;
};

module.exports = Mongo;