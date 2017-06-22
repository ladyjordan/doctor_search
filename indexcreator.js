var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});


client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('Elasticsearch cluster is down');
    } else {
        console.log('All set!');
    }
});

/** creates index - directory and type - doctor in elasticsearch */
client.indices.create({
    index: 'directory'
}, function(err, resp, status) {
    if (err) {
        console.log(err);
    } else {
        console.log("create", resp);
    }
});