const express = require('express')
const request = require('request')
const querystring = require('querystring')

const db = require('./db/db')

const app = express()

const redirect_uri =
  process.env.REDIRECT_URI || 'http://localhost:8888/callback'

app.get('/login', function(req, res) {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope:
          'user-read-private user-read-email playlist-modify-public user-read-recently-played streaming user-modify-playback-state user-read-currently-playing',
        redirect_uri
      })
  )
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token).catch(error)
  })
})

const PORT = process.env.PORT || 8888

const init = () => {
  db.sync()
  app.listen(PORT, () => {
    console.log(
      `Listening on port ${8888}. Go /login to initiate authentication flow.`
    )
  })
}

init()
