## Proxy Node.js API (to search doctors) with data persistence using Elastic Search ###

This is a node.js proxy API that calls the BetterDoctor API to search for doctors in an geographic area, and persists data using elasticsearch.


##### Instructions to setup and run

1. Run Elastic search server(default port 9100). 
1. [OPTIONAL] Install and run elasticsearch-head (web front end for Elasticsearch cluster) runs on port 9200. 
2. cd doctor_search/
3. Get you API keys and add to the server.js file.
4. Run - $node indexcreator.js ,ONCE to set up the directory index. 
5. Run - $node server.js ,express http server runs at port 8800.
6. Hit example  - http://localhost:8800/api/v1/doctors/firstname in the browser address bar

#### First Hit - Proxy API gets results from 3rd party API
![alt text](resultImages/firstHitForName_BdAPICall.png)

#### Second Hit - API retrieves cached data from Elasticsearch
![alt text](resultImages/SecondHitForSameName_CallToES.png)
