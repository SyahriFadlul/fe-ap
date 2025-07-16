<script setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';


const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
})

onMounted(async () => {
  authStore.isAuthenticated
   
})
</script>
<template>
  <div class="login uk-margin-xlarge-top uk-flex uk-flex-center">
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@s uk-width-1-3@m uk-width-1-4@l uk-width-1-5@xl">
      <h3 class="uk-card-title uk-text-center">Login</h3>
      <form @submit.prevent="authStore.handleLogin(form)">
        <div class="uk-margin">
          <label class="uk-form-label" for="username">Username</label>
          <input class="uk-input" type="text" id="username" v-model="form.username" required>
        </div>
        <div class="uk-margin">
          <label class="uk-form-label" for="password">Password</label>
          <input class="uk-input" type="password" id="password" v-model="form.password" required>
        </div>
        <button class="uk-button uk-button-primary uk-width-1-1" type="submit">Login</button>
      </form>
      <button @click.prevent="authStore.skip()">skip</button>
    </div>
  </div>
</template>
<style scoped>
.login {
  margin: 0 !important;
}
</style>