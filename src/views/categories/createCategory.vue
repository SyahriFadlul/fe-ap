<script setup>
import { useCategoryStore } from '@/stores/category'
import { onMounted, ref, nextTick } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useUnitStore } from '@/stores/unit'
import { useRoute, useRouter } from 'vue-router'

const categoryStore = useCategoryStore()
const unitStore = useUnitStore()
const router = useRouter()

const data = ref({
  name: '',
  note: ''
})

function cancel(){
  router.go(-1)
}

watch(data,(newVal)=>{
  if(Object.values(newVal).every(value => value === '' || value == null)){ //cek data kosong atw tdk
    console.log(newVal);
    categoryStore.hasUnsavedChanges = false
  }else{
    categoryStore.hasUnsavedChanges = true
  }
}, { deep: true })

onMounted( async ()=>{
  categoryStore.errors = []
  if (categoryStore.categoryItems.length < 1){
    await categoryStore.fetchCategories()
  }
  if (unitStore.unitItems.length < 1){
    await unitStore.fetchUnits()
  }  
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/categories">
        <icon-arrow-left :size="24"/>
      </router-link>       
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        Tambah Kategori Baru
      </div>
    </div>
    <div class="card">
      <div class="uk-margin-small-bottom">
        <div class="label">Nama Kategori</div>
        <input type="text" class="uk-width-3-5 uk-input uk-form-small" v-model="data.name">
        <span v-if="categoryStore.error !== ''" v-for="error in categoryStore.error" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error[0] }}</span>  
      </div>
      <div class="uk-flex uk-flex-column uk-width-3-5 uk-margin-small-bottom">
        <label class="label">Catatan <span class="uk-text-muted">(Opsional)</span></label>
        <textarea type="" class="uk-textarea uk-form-small" v-model="data.note"></textarea>
      </div>
      <div class="uk-flex uk-flex-row uk-flex-right uk-margin-medium-top">
        <button class="btn-cnl uk-margin-medium-right" @click="cancel()">Batalkan</button>
        <button class="btn-sve" @click="categoryStore.createCategory(data)">Simpan</button>
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

select {
  width: 150px;
}
</style>