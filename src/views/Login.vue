<script setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';


const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
})

const togglePassword = ref(false)

onMounted(async () => {
  authStore.isAuthenticated
   
})
</script>
<template>
  <div class="login uk-margin-xlarge-top uk-flex uk-flex-center">
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@s uk-width-1-3@m uk-width-1-4@l">
      <h3 class="uk-card-title uk-text-center">Login</h3>
      <form @submit.prevent="authStore.handleLogin(form)">
        <div class="uk-margin">
          <label class="uk-form-label" for="username">Username</label>
          <input class="uk-input" type="text" id="username" v-model="form.username" required>
          <div v-if="authStore.error?.username" class="uk-text-danger">{{ authStore.error.username[0] }}</div>
        </div>
        <div class="uk-margin">
          <div class="uk-form-label" for="password">Password</div>
          <div class="uk-inline uk-width-1-1">
            <input class="uk-input" :type="togglePassword ? 'text' : 'password'" id="password" v-model="form.password" required>
            <button class="uk-form-icon uk-form-icon-flip toggle-password" type="button" 
              @click="()=>togglePassword = !togglePassword" :class="{'uk-active': togglePassword}"
              :uk-icon="togglePassword ? 'icon: eye; ratio: 1.2' : 'icon: eye-slash; ratio: 1.2'">
            </button>
          </div>
          <div v-if="authStore.error?.password" class="uk-text-danger">{{ authStore.error.password }}</div>
        </div>
        <button class="uk-button uk-button-primary uk-width-1-1" type="submit">Login</button>
      </form>
      <!-- <button @click="authStore.skip()">skip</button> -->
    </div>
  </div>
</template>
<style scoped>
</style>