const express = require('express')
const app = express()

app.set('view engine', 'ejs');

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

var SpotifyWebApi = require('spotify-web-api-node');
var config = require('./config.js')
var spotifyApi = new SpotifyWebApi(config);

app.get('/', function (req, res) {
    res.render('index');
})

let request = require('request');

app.post('/', function (req, res) {
    let artist = req.body.artist;
    console.log(artist);

    spotifyApi
        .clientCredentialsGrant()
        .then(function (data) {

            //gets your access token so you can actually get into the API
            spotifyApi.setAccessToken(data.body['access_token']);


            //searches for a track in the spotify database w a keyword from the horoscope
            return spotifyApi.searchTracks(artist);
        })
        .then(function (data) {

            console.log(data.body.tracks.items[0].name);
            console.log("sdfsd");
            console.log(data.body.tracks.items[0].external_urls.spotify);

            request(artist, function (err, response, body) {




                let songs = `Your song by ${artist} is  ${data.body.tracks.items[0].name}.Here is the link to it: ${data.body.tracks.items[0].external_urls.spotify} `;
                console.log(songs);

                res.render('index', {
                    songs: songs,
                    error: null
                });
                console.log(songs);


            })
        })
})





app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
