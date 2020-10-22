<template lang="pug">
  v-container
    v-row
      v-col
        div
          h1 Text To Speach
          v-form()
            v-text-field(label="File" placeholder="new.ogg" v-model="file" required)
            v-select(label="Format" v-model="format" :items="formats")
            v-switch(v-model="ssmlMode" label="SSML Mode")
            v-textarea(v-if="ssmlMode" label="SSML" v-model="ssml" required) 
            v-textarea(v-else label="Text" v-model="text" required) 
            .voice-options
              v-select(label="Voice" v-model="voice" :items="voices")
              v-select(label="Gender" v-model="gender" :items="genders")
              v-select(label="Language" v-model="language" :items="languages")
            v-btn(@click="speak") Speak
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'HelloWorld',

    data: () => ({
      file: "",
      format: "OGG_OPUS",
      formats: ["OGG_OPUS", "MP3", "LINEAR16"],
      gender: "MALE",
      genders: ["MALE", "FEMALE", "NEUTRAL"],
      text: "",
      ssml: "<speak></speak>",
      ssmlMode: false,
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
      ],
      voice: "en-US-Wavenet-A",
      language: "en-US",
      languages: [
        "en-US",
        "en-GB",
        "en-AU",
        "en-IN",
        "es-ES",
      ],
    }),

    methods: {
      speak() {
        // make POST request
        const baseURI = 'http://localhost:3000/speak';
        let payload = {
          outputFile: this.file,
          text: this.text,
          ssml: this.ssml,
          ssmlMode: this.ssmlMode,
          language: this.language,
          voiceName: this.voice,
          gender: this.gender,
        };
        
        this.$http.post(baseURI, payload)
        .then((result) => {
          this.users = result.data
        })
      }
    }
  })
</script>

<style lang="sass" scoped>
.voice-options
  display: flex
</style>