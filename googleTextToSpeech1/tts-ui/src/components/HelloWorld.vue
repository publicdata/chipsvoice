<template lang="pug">
  v-container
    v-row
      v-col
        div
          h1 Text To Speach
          v-form()
            v-text-field(label="File" v-model="file" required)
            v-select(label="Format" v-model="format" :items="formats")
            v-textarea(label="Message" v-model="text" required) 
            v-select(label="Voice" v-model="voice" :items="voices")
            v-btn(@click="speak") Speak
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'HelloWorld',

    data: () => ({
      file: "New",
      format: "OGG_OPUS",
      formats: ["OGG_OPUS", "MP3", "LINEAR16"],
      text: "",
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
      voice: 0,
    }),

    methods: {
      speak() {
        // make POST request
        const baseURI = 'http://localhost:3000/speak'
        this.$http.post(baseURI, {
          outputFile: this.file,
          text: this.text,
          voiceName: this.voice,
        })
        .then((result) => {
          this.users = result.data
        })
      }
    }
  })
</script>
