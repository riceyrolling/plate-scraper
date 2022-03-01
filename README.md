# Australian Vehicle Registration Lookup Automation
## Warning!
This tool may stop working at any point in time if rego lookup websites are updated. I'll do my best to maintain the code and keep it working. Don't abuse the tool, most of the states websites are protected by Cloudflare so you will get blocked.
## Installation
Clone the git repo and install requirements using npm. 
```
git clone https://github.com/riceyrolling/plate-scraper/
cd plate-scraper
npm install
```
## Usage
Start the server with `server.js`. Default port is 8083.
```
node server.js
```
To search for a plate provide `plate` and `state` parameters.
```
GET http://localhost:8083/search?plate=1ABC234&state=WA
```
## TODO
| State  | Status |
|--------|--------|
| WA     | :white_check_mark: |
| VIC    | :white_check_mark: |
| NSW    ||
| QLD    ||
| NT     ||
| ACT    ||
| SA     ||
| TAS    ||