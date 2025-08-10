<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'


const userStore = useUserStore()
const router = useRouter()

function cancel(){
  router.go(-1)
}

const togglePassword = ref(false)

const data = ref({
  username: '',
  password: '',
  role: '',
})

watch(()=> data.value.role,(newVal)=>{
  if(newVal === '')data.value.role = ''
})

onMounted( async ()=>{
  data.value.role = 'kosong'
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/users">
        <button class="btn-back uk-button uk-button-small">
          <icon-arrow-left :size="24"/>
        </button>        
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        Tambah User Baru
      </div>
    </div>
    <div class="card uk-flex uk-flex-middle">      
      <div class="uk-flex uk-flex-column uk-width-3-5 uk-margin-small-bottom">
        <label class="label">Username</label>
        <input type="text" class="uk-input uk-form-small" v-model="data.username" placeholder="Masukkan nama pengguna">
      </div>  
      <div class="uk-flex uk-flex-column uk-margin-small-top uk-width-3-5">
        <div class="label">Password</div>
        <div class="uk-inline">
          <input :type="togglePassword ? 'text' : 'password'" class="uk-input uk-form-small" 
          v-model="data.password" placeholder="Masukkan password">
          <button class="uk-form-icon uk-form-icon-flip toggle-password" type="button"
          @click="()=>togglePassword = !togglePassword" :class="{'uk-active': togglePassword}"
          :uk-icon="togglePassword ? 'icon: eye; ratio: 1.2' : 'icon: eye-slash; ratio: 1.2'"></button>
        </div>
      </div>
      <div class="uk-flex uk-flex-column uk-margin-small-top uk-width-3-5">
        <div class="label">Role</div>
        <select class="uk-form-small om uk-width-1-1" v-model="data.role" placeholder="- - Pilih Role - -">
          <option value="kosong" class="" disabled selected>- - Pilih Role - -</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>     
      </div>      
      <div class="uk-flex uk-flex-row uk-flex-right uk-margin-medium-top">
        <button class="btn-cnl uk-margin-medium-right" @click="()=>router.go(-1)">Batalkan</button>
        <button class="btn-sve" @click="userStore.createUser(data)">Simpan</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  padding: 20px;
  padding-top: 100px;
  border: 1px solid #eee;
  border-radius: 8px;
  height: 500px;
}

.btn-back{
  border: none;
  border-radius: 8px;
}

.btn-cnl{
  width: 150px;
  border: none;
  border-radius: 8px;
  padding: 10px;
  background-color: #E5E5E5;
}
.btn-cnl:hover{
  background-color: #D5D5D5;
}
.btn-sve{
  width: 150px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #1E87F0; /*1E87F0  0F7AE5*/
}
.btn-sve:hover{
  background-color: #0F7AE5;
}

.label{
  font-size: 15px;
  color: black;
  font-weight: 500;
}

select {
  box-sizing: border-box;
  height: 30px !important;
  /* line-height: 40px; */
  padding: 0 10px;
}


.toggle-password:hover {
  color: #000;
}
</style>