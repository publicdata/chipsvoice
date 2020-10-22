<template lang="pug">
  v-container
    v-row
      v-col
        div
          h1 Text To Speach
          v-form()
            v-text-field(label="File" v-model="file")
            v-textarea(label="Message" v-model="text" required) 
            v-btn(@click="speak") Speak
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'HelloWorld',

    data: () => ({
      file: "",
      text: "",
    }),

    methods: {
      speak() {
        // make POST request
        const baseURI = 'http://localhost:3000/speak'
        this.$http.post(baseURI, {
          outputFile: this.file,
          text: this.text,
        })
        .then((result) => {
          this.users = result.data
        })
      }
    }
  })
</script>
