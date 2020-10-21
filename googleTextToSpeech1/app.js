var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { spawn, exec } = require('child_process');

// Imports Google Cloud client library for TTS
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

app.post("/synth", async (req, res) => {
  //console.log(req.body) // Call your action on the request here
  var text = req.body.text;
  var ssml = req.body.ssml;
  var language = req.body.language;
  var gender = req.body.gender;
  var voiceName = req.body.voiceName;
  var voice = {languageCode: language, name: voiceName, ssmlGender: gender};
  var format = req.body.format ? req.body.format : 'MP3';
  var rate = req.body.rate ? req.body.rate : 1.0;
  var pitch = req.body.pitch ? req.body.pitch : 1.0;
  var gain = req.body.gain ? req.body.gain : 3.0;
  var audioConfig = {
    "audioEncoding": format,
    "speakingRate": rate,
    "pitch": pitch,
    "volumeGainDb": gain,
  };
  // TODO: text fallback on SSML error if both present
  var input;
  if (!!ssml) input = {ssml: ssml};
  else input = {text: text};
  // generate audio
  var outputFile = req.body.outputFile ? req.body.outputFile : 'output.mp3';
  await audio(input, voice, audioConfig, outputFile);
})

app.post("/synthNSpeak", async (req, res) => {
  //console.log(req.body) // Call your action on the request here
  var text = req.body.text;
  var ssml = req.body.ssml;
  var language = req.body.language;
  var gender = req.body.gender;
  var voiceName = req.body.voiceName;
  var voice = {languageCode: language, name: voiceName, ssmlGender: gender};
  var format = req.body.format ? req.body.format : 'MP3';
  var rate = req.body.rate ? req.body.rate : 1.0;
  var pitch = req.body.pitch ? req.body.pitch : 1.0;
  var gain = req.body.gain ? req.body.gain : 3.0;
  var audioConfig = {
    "audioEncoding": format,
    "speakingRate": rate,
    "pitch": pitch,
    "volumeGainDb": gain,
  };
  // TODO: text fallback on SSML error if both present
  var input;
  if (!!ssml) input = {ssml: ssml};
  else input = {text: text};
  // generate audio
  var outputFile = req.body.outputFile ? req.body.outputFile : 'output.mp3';
  await audio(input, voice, audioConfig, outputFile);
  const vlc = exec(`vlc --one-instance ${outputFile}`);
  vlc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  vlc.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  vlc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
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

async function audio(input, voice, audioConfig, outputFile) {
  const request = {
    input: input,
    voice: voice,
    audioConfig: audioConfig,
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFile, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${outputFile}`);
}

module.exports = app;
