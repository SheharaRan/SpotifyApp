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
//    res.render('index');
    res.render('index', {
                    songs: null,
                    error: null
                });
})

let request = require('request');

app.post('/', function (req, res) {
    let artist = req.body.artist;
    console.log(artist);

    spotifyApi
        .clientCredentialsGrant()
        .then(function (data) {

            spotifyApi.setAccessToken(data.body['access_token']);


            return spotifyApi.searchTracks(artist);
        })
        .then(function (data) {

            console.log(data.body.tracks.items[0].name);
            console.log("sdfsd");
            console.log(data.body.tracks.items[0].external_urls.spotify);

            request(artist, function (err, response, body) {

                let songs = `Your song by ${artist} is  ${data.body.tracks.items[0].name}. Here is the link to it: ${data.body.tracks.items[0].external_urls.spotify} `;
                console.log(songs);

                res.render('index', {
                    songs: songs,
                    error: null
                });



            })
        })
})





app.listen(4000, function () {
    console.log('Example app listening on port 4000!')
})
