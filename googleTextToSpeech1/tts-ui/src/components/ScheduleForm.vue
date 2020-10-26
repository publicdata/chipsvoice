<template lang="pug">
  v-container
    v-row
      v-col
        v-card
          v-card-title Schedule Clip
          v-card-text            
            v-switch(v-model="repeat" label="Repeat")
            v-slider(label="Count" min="0" max="10" v-model="count" thumb-label)
            v-slider(label="Interval" min="0" max="3600" step="15" v-model="interval" thumb-label)
          v-card-actions
            v-spacer
            v-btn(@click="save") Save
            v-btn(@click="cancel") Cancel
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'ScheduleForm',

    data: () => ({
      repeat: true,
      count: 0,
      interval: 3,
    }),

    methods: {
      save() {},
      cancel() {},
    }
  })
</script>

<style lang="sass" scoped>
.voice-options, .actions
  display: flex
</style>