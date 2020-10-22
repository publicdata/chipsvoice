<template lang="pug">
  v-container
    v-row
      v-col
        div
          h1 Text To Speach
          v-form()
            v-text-field(label="File" placeholder="new.ogg" v-model="file" required)
            v-select(label="Format" v-model="format" :items="formats")
            v-slider(label="Pitch" v-model="pitch")
            v-slider(label="Speed" v-model="speed")
            v-slider(label="Volume" v-model="volume")
            v-switch(v-model="ssmlMode" label="SSML Mode")
            v-textarea(v-if="ssmlMode" label="SSML" v-model="ssml" required) 
            v-textarea(v-else label="Text" v-model="text" required) 
            v-switch(v-model="voiceMode" label="Specific Voice")
            .voice-options
              v-select(label="Voice" v-model="voice" :items="voices")
              v-select( label="Language" v-model="language" :items="languages")
              v-select(label="Gender" v-model="gender" :items="genders")
            .actions
              v-btn(@click="synth") Synth
              v-btn(@click="speak") Speak
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'HelloWorld',

    data: () => ({
      file: "new.ogg",
      format: "OGG_OPUS",
      formats: ["OGG_OPUS", "MP3", "LINEAR16"],
      pitch: "1.0",
      speed: "1.0",
      volume: "1.0",
      gender: "MALE",
      genders: ["MALE", "FEMALE", "NEUTRAL"],
      text: "Hello world",
      ssml: "<speak>Hello world</speak>",
      ssmlMode: false,
      language: "en-US",
      languages: [
        "en-US",
        "en-GB",
        "en-AU",
        "en-IN",
        "es-ES",
      ],
      voiceMode: true,
      voice: "en-US-Wavenet-A",
      voices: [
        "en-US-Wavenet-A",
        "en-US-Wavenet-B",
        "en-US-Wavenet-C",
        "en-US-Wavenet-D",
        "en-US-Wavenet-E",
        "en-US-Wavenet-F",
        "en-US-Wavenet-G",
        "en-US-Wavenet-H",
        "en-US-Wavenet-I",
        "en-US-Wavenet-J",
        "en-GB-Wavenet-A",
        "en-GB-Wavenet-B",
        "en-GB-Wavenet-C",
        "en-GB-Wavenet-D",
        "en-GB-Wavenet-F",
        "en-AU-Wavenet-A",
        "en-AU-Wavenet-B",
        "en-AU-Wavenet-C",
        "en-AU-Wavenet-D",
        "en-IN-Wavenet-A",
        "en-IN-Wavenet-B",
        "en-IN-Wavenet-C",
        "en-IN-Wavenet-D",
        "es-ES-Standard-A",
      ],
    }),

    methods: {
      speak() {
        // make POST request
        const baseURI = 'http://localhost:3000/speak';
        let voice = this.voiceMode ?
          {voice: this.voice} :
          {language: this.language, gender: this.gender};
        let audio = {
          format: this.format,
          pitch: this.pitch,
          speed: this.speed,
          volume: this.volume,
        };
        let payload = {
          outputFile: this.file,
          ssml: this.ssml,
          text: this.text,
          ssmlMode: this.ssmlMode,
          voiceMode: this.voiceMode,
          ...voice,
          ...audio,
        };
        console.log(payload, voice);
        
        
        this.$http.post(baseURI, payload)
        .then((result) => {
          console.log(result.data);
        })
      },
      synth() {
        // make POST request
        const baseURI = 'http://localhost:3000/synth';
        let voice = !!this.voiceMode ?
          {voiceName: this.voiceName} :
          {language: this.language, gender: this.gender};
        let audio = {
          format: this.format,
          pitch: this.pitch,
          speed: this.speed,
          volume: this.volume,
        };
        let payload = {
          outputFile: this.file,
          ssml: this.ssml,
          text: this.text,
          ssmlMode: this.ssmlMode,
          voiceMode: this.voiceMode,
          ...voice,
          ...audio,
        };
        
        this.$http.post(baseURI, payload)
        .then((result) => {
          console.log(result.data);
        })
      }
    }
  })
</script>

<style lang="sass" scoped>
.voice-options, .actions
  display: flex
</style>