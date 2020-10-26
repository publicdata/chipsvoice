<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <AnnouncementForm msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import AnnouncementForm from '@/components/AnnouncementForm.vue'

export default {
  name: 'Home',
  components: {
    AnnouncementForm
  }
}
</script>
