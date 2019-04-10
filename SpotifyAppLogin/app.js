var fs = require('fs');
var data = fs.readFileSync('login.json');
var login = JSON.parse(data);


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({
    extended: true
}));


var SpotifyWebApi = require('spotify-web-api-node');
var config = require('./config.js')
var spotifyApi = new SpotifyWebApi(config);

let request = require('request');

app.get('/', function (req, res) {
    res.render('index');

})

app.post('/', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    login[username] = password;
    var data = JSON.stringify(login);
    fs.writeFile('login.json', data, finished);

    function finished(err) {
        console.log('got the contact')
        res.redirect('/app/' + username);
    }
    var reply = {
        msg: "Thank you for your contact."
    }
})

app.get('/app/:username', function (req, res) {
    res.render('app', {
        songs: null,
        error: null,
        name: req.params.username
    });
})

app.post('/app/:username', function (req, res) {
    let artist = req.body.artist;
    console.log(artist);

    spotifyApi
        .clientCredentialsGrant()
        .then(function (data) {

            //gets your access token so you can actually get into the API
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

                res.render('app', {
                    songs: songs,
                    error: null,
                    name: req.params.username
                });
                console.log(songs);
            })
        })
})


app.listen(4000, function () {
    console.log('Example app listening on port 4000!')
})
