# REST API for Yoga Sanskrit Poses

### Development Setup
- Clone repository
- `npm install`

### Run server locally
`mongod --dbpath ~/path/to/data/directory`

Example:
`mongod --dbpath ~/code/mongo-data`

While Mongo DB is running, in a new terminal
`node server/server.js`

### Testing

##### To run full test suite:
`npm test`
##### To run while developing tests:
`npm run test-watch`

### Deploy to Heroku
`git push heroku master`
`heroku open` opens app on correct URL
