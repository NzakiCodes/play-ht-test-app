const express = require("express");
const fetch = require("node-fetch");
const cors = require('cors');
const { json } = require("express");
const AWS = require("aws-sdk");
const app = express();
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');



app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const Polly = new AWS.Polly({
    region: "us-west-2"
})



class PollyFetch {
    constructor() {
        this.url = "https://polly.us-west-2.amazonaws.com/v1";
        this.engine = "standard";
        this.languageCode = "en-US";
        this.outputFormat = "mp3";
        this.speechMarkTypes = ["word", "sentence"];
        this.sampleRate = "22050";
    }
    voices(cb) {

        console.log(res);

    }

    async listen(voiceId, text, OutputFormat = this.outputFormat, engine = this.engine, textType = "text", SpeechMarkTypes = this.speechMarkTypes, SampleRate = this.sampleRate, langCode = this.languageCode, lexiconNames = [""]) {

        var parameters = {
            "Engine": engine,
            "LanguageCode": langCode,
            "LexiconNames": [...lexiconNames],
            "OutputFormat": OutputFormat,
            "SampleRate": SampleRate,
            "SpeechMarkTypes": [...SpeechMarkTypes],
            "Text": text,
            "TextType": textType,
            "VoiceId": voiceId
        };

        var options = {
            method: "post",
            body: JSON.stringify(parameters),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "polly AKIA5OROYF44ZBAPK46A:sv6D8bS6INZ2YDBZxaveDTj4a/2mHCB1mQB9pHZo"
            },

        }

        Polly.synthesizeSpeech()
        return speech;
    }
    write_file(stream) {
        if (stream) {
            fs.writeFile(__dirname, '');
            fs.createReadStream()
        }
    }

}

var polly = new PollyFetch();


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
                var file_name = '/'+text.slice(0, 15) + '-TTS-sound.'+OutputFormat[0];
                var file_dir = path.join(__dirname + '/public/', file_name );
                fs.writeFile(file_dir, AudioStream, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    return res.json({ message: 'success', data: file_name  });
                });

            }
        });
});

app.get("/", (req, res) => {
    res.json(
        {
            data: {
                "name": "Play.ht test"
            }
        }
    )
});


const port = process.env.PORT || 5000;



app.listen(port, () => console.log(`Play.Voice Server running on port ${port} 🔥`));
