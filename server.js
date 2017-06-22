var express = require('express');
var app = express();
var https = require('https');
var request = require('request');
var elasticsearch = require('elasticsearch');

app.set('json spaces', 2);

/* Proxy API which searches doctor records by first name*/
app.get('/api/v1/doctors/:name', function(req, res) {

    var name = req.params.name;

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
            console.log('All set to go!');
        }
    });


    /* elastic client searches directory index for first name before calling API */
    client.search({
        index: 'directory',
        type: 'doctors',
        body: {
            query: {
                match: {
                    "First_Name": name
                }
            }
        }
    }).then(function(resp) {
        hits = resp.hits.hits;


        /* If we have existing records for doctors by the given name, display them */
        if (hits != 0) res.json({
            doctorresults: hits
        });

        /* if no records for the doctor found, call API*/
        if (hits.length == 0) {

            /* location, limit preset for right now */
            var newurl = 'https://api.betterdoctor.com/2016-03-01/doctors?name=' + name + '&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=10&limit=10&user_key=add-your-key';
            request(newurl);

            request(newurl, function(error, response, body) {
                console.log('error:', error);

                var rec = JSON.parse(body);
                res.json({
                    doctorresults: rec
                });

                /* CACHE - loops through all the records(max 10), and indexes to elasticsearch*/
                for (i = 0; i < rec.data.length; i++) {

                    var first_name = rec.data[i].profile.first_name;
                    var last_name = rec.data[i].profile.last_name;

                    client.index({
                        index: 'directory',
                        type: 'doctors',
                        body: {
                            "First_Name": first_name,
                            "Last_Name": last_name
                        }
                    }, function(err, resp, status) {
                        console.log(resp);
                    });
                }

            });
        }

    }, function(err) {

    });
});


app.listen(8800);
console.log('Listening on port ');