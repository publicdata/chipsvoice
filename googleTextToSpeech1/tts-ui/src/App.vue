<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        Auto Announcer
      </div>

    </v-app-bar>

    <v-main>
      <AnnouncementForm/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AnnouncementForm from './components/AnnouncementForm.vue';

export default Vue.extend({
  name: 'App',

  components: {
    AnnouncementForm,
  },

  data: () => ({
    //
  }),
});
</script>
