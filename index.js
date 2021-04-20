const express = require("express");
const fetch = require("node-fetch");
const cors = require('cors');
const { json } = require("express");
const AWS = require("aws-sdk");
const app = express();
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

app.use(express.static(path.join(__dirname, 'client/public')))// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
})

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const Polly = new AWS.Polly({
    region: "us-west-2"
})



app.get("/voices", (req, res) => {
    var params = {
        LanguageCode: "en-GB"
    };

    Polly.describeVoices(params,
        function (err, { Voices }) {
            if (err) {
                console.log(err, err.stack);
            } else {
                return res.json({ message: 'success', data: Voices });
            }
        });
});

app.post("/listen", (req, res) => {
    const { voiceId, OutputFormat, text } = req.body;

    // Parameters for sending a synthesize Speech Request
    var parameters = {
        "Engine": "standard",
        "LanguageCode": "en-US",
        "OutputFormat": OutputFormat[0],
        "SampleRate": "22050",
        "Text": text,
        "TextType": "text",
        "VoiceId": voiceId
    };
    Polly.synthesizeSpeech(parameters,
        function (err, { AudioStream }) {
            if (err) {
                console.log(err, err.stack);
            } else {
                var file_name = '/' + text.slice(0, 15) + '-TTS-sound.' + OutputFormat[0];
                var file_dir = path.join(__dirname + '/public/', file_name);
                fs.writeFile(file_dir, AudioStream, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    return res.json({ message: 'success', data: file_name });
                });

            }
        });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
});


const port = process.env.PORT || 5000;



app.listen(port, () => console.log(`Play.Voice Server running on port ${port} 🔥`));
