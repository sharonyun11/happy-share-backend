const http = require('http')
const User = require('./db/models/user')
const app = require('./app')
const server = http.createServer(app)

const PORT = 3000
