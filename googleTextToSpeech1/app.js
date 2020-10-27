var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var logger = require('morgan');
const { spawn, exec } = require('child_process');
const { promisify } = require('util')
// Imports Google Cloud client library for TTS
const textToSpeech = require('@google-cloud/text-to-speech');

const sleep = promisify(setTimeout);

// setup MIDI interface
var easymidi = require('easymidi');
var midiOutputName = 'loopMIDI Port 1';
var output;
var devices = easymidi.getOutputs();
//console.log(devices);
try {
  output = new easymidi.Output(midiOutputName);
} catch (err) {
  console.log(`Selected default midi (last in list): ${devices[-1]}`)
  output = new easymidi.Output(devices[-1]);
}

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var volume = 0;
var unity = 102;

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.post("/hook", (req, res) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).end() // Responding is important
})

app.post("/learnmute", (req, res) => {
  learnMute();
  res.status(200).end() // Responding is important
})

app.post("/learnfade", (req, res) => {
  learnFade();
  res.status(200).end() // Responding is important
})

app.post("/synth", async (req, res) => {
  //console.log(req.body) // Call your action on the request here
  var voice = {
    languageCode: req.body.language ? req.body.language : 'en-US',
    name: req.body.voiceName ? req.body.voiceName : (!req.body.language || !req.body.gender) ? "en-US-Wavenet-A" : "",
    ssmlGender: req.body.gender ? req.body.gender : "NEUTRAL"
  };
  var audioConfig = {
    "audioEncoding": req.body.format ? req.body.format : 'OGG_OPUS',
    "speakingRate": req.body.rate ? req.body.rate : 1.0,
    "pitch": req.body.pitch ? req.body.pitch : 1.0,
    "volumeGainDb": req.body.gain ? req.body.gain : 3.0,
  };
  // TODO: text fallback on SSML error if both present
  var input;
  if (!!req.body.ssmlMode) input = {ssml: req.body.ssml};
  else input = {text: req.body.text};
  // generate audio
  var outputFile = req.body.outputFile ? req.body.outputFile : 'output.mp3';
  await audio(input, voice, audioConfig, outputFile);
})

app.post("/speak", async (req, res) => {
  console.log(req.body) // Call your action on the request here
  var voice = {
    languageCode: req.body.language ? req.body.language : 'en-US',
    name: req.body.voiceMode ? req.body.voice : (!req.body.language || !req.body.gender) ? "en-US-Wavenet-A" : "",
    ssmlGender: req.body.gender ? req.body.gender : "NEUTRAL"
  };
  console.log(voice.name)
  var audioConfig = {
    "audioEncoding": req.body.format ? req.body.format : 'OGG_OPUS',
    "speakingRate": req.body.rate ? req.body.rate : 1.0,
    "pitch": req.body.pitch ? req.body.pitch : 1.0,
    "volumeGainDb": req.body.gain ? req.body.gain : 3.0,
  };
  // TODO: text fallback on SSML error if both present
  var input;
  if (req.body.ssmlMode === true) input = {ssml: req.body.ssml};
  else input = {text: req.body.text};
  // generate audio
  var outputFile = req.body.outputFile ? req.body.outputFile : 'output.mp3';
  await audio(input, voice, audioConfig, outputFile);
  playFile(outputFile);
  res.status(200).end() // Responding is important
})

app.post("/play", async (req, res) => {
  var file = req.body.file;
  playFile(file);
  res.status(200).end() // Responding is important
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function playFile(file) {
  //console.log(req.body) // Call your action on the request here
  fadeOut();
  const vlc = exec(`vlc --one-instance ${file}`);
  vlc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  vlc.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  vlc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    setTimeout(fadeIn, 2000);
  });
}

async function fadeTo(level) {
  var diff = level - volume;
  var fadeDelay = 10;
  for (let i=0; i++; i<Math.abs(diff)) {
    await sleep(fadeDelay);
  }
    volume += (diff % 1)
    output.send('cc', {
      controller: 0,
      value: volume,
      channel: 3
    });
}

function fadeOut() {
  fadeTo(0);
}

function fadeIn() {
  fadeTo(unity);
}

function mute() {
  output.send('cc', {
    controller: 0,
    value: 1,
    channel: 4
  });
}

function learnMute() {
  output.send('cc', {
    controller: 0,
    value: 1,
    channel: 4
  });
}

function learnFade() {
  output.send('cc', {
    controller: 0,
    value: 1,
    channel: 3
  });
}

async function synth() {

}

async function audio(input, voice, audioConfig, outputFile) {
  const request = {
    input: input,
    voice: voice,
    audioConfig: audioConfig,
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = promisify(fs.writeFile);
  await writeFile(outputFile, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${outputFile}`);
}

module.exports = app;
