<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'
import { useSupplierStore } from '@/stores/supplier'

const supplierStore = useSupplierStore()
const router = useRouter()

const data = ref({
  company_name: supplierStore.selectedSupplier.company_name,
  company_phone: supplierStore.selectedSupplier.company_phone,
  contact_person_name: supplierStore.selectedSupplier.contact_person_name,
  contact_person_phone: supplierStore.selectedSupplier.contact_person_phone,
  note: supplierStore.selectedSupplier.note,
})

function cancel(){
  supplierStore.editing = false
}

onMounted( async ()=>{
  supplierStore.errors = []
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/suppliers">
        <icon-arrow-left :size="24"/>
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        {{ supplierStore.editing ? 'Edit Supplier' : 'Detail Supplier' }}
      </div>
    </div>
    <div class="card">
      <div class="uk-margin-small-bottom">
        <div class="label">Nama Instansi</div>
        <input type="text" class="uk-width-3-5 uk-input uk-form-small" :disabled="!supplierStore.editing" v-model="data.company_name">
        <span v-if="supplierStore.error !== ''" v-for="error in supplierStore.error.company_name" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span> 
      </div>
      <div class="uk-margin-small-bottom">
        <div class="label">Nomor Telepon Instansi</div>
        <input type="text" class="uk-width-3-5 uk-input uk-form-small" :disabled="!supplierStore.editing" v-model="data.company_phone">
        <span v-if="supplierStore.error !== ''" v-for="error in supplierStore.error.company_phone" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span> 
      </div>  
      <div class="uk-margin-small-bottom">
        <div class="label">Nama Kontak Person</div>
        <input type="text" class="uk-width-3-5 uk-input uk-form-small" :disabled="!supplierStore.editing" v-model="data.contact_person_name">
        <span v-if="supplierStore.error !== ''" v-for="error in supplierStore.error.contact_person_name" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span> 
      </div>  
      <div class="uk-margin-small-bottom">
        <div class="label">Nomor Telepon Kontak Person</div>
        <input type="text" class="uk-width-3-5 uk-input uk-form-small" :disabled="!supplierStore.editing" v-model="data.contact_person_phone">
        <span v-if="supplierStore.error !== ''" v-for="error in supplierStore.error.contact_person_phone" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span> 
      </div>  
      <div class="uk-margin-small-bottom">
        <div class="label">Catatan <span class="uk-text-capitalize uk-text-muted">(Opsional)</span></div>
        <textarea rows="3" class="uk-textarea uk-width-3-5 uk-form-small" :disabled="!supplierStore.editing" v-model="data.note"></textarea> 
        <span v-if="supplierStore.error !== ''" v-for="error in supplierStore.error.note" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span> 
      </div>    
      <div class="uk-flex uk-flex-row uk-flex-right uk-margin-medium-top">
        <button class="btn-cnl uk-margin-medium-right" @click="cancel()" v-if="supplierStore.editing">Batalkan</button>
        <button class="btn-sve uk-text-capitalize" @click="supplierStore.editSupplier()" v-if="!supplierStore.editing" style="width: 75px;">edit</button>
        <button class="btn-sve" @click="supplierStore.updateSupplier(data)" v-if="supplierStore.editing">Simpan</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.btn-back{
  border: none;
  border-radius: 8px;
}

.btn-cnl{
  border: none;
  border-radius: 8px;
  padding: 10px;
  background-color: #E5E5E5;
}
.btn-cnl:hover{
  background-color: #D5D5D5;
}
.btn-sve{
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
}

.unit-wrapper {
  width: 207.78px
}
input:disabled, textarea:disabled {
  background-color: #f9f9f9 !important;
  color: #000 !important;
  cursor: default;
}
select {
  width: 150px;
}
</style>