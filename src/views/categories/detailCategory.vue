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
  name: categoryStore.selectedCategory.name,
  note: categoryStore.selectedCategory.note
})

function cancel(){
  categoryStore.editing = false
}

onMounted( async ()=>{
  categoryStore.errors = []
  categoryStore.editing = false
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
        {{categoryStore.editing ? 'Edit Kategori':'Detail Kategori'}}
      </div>
    </div>
    <div class="card">
      <div class="uk-margin-small-bottom">
        <div class="label">Nama Kategori</div>
        <input type="text" class="uk-width-3-5 uk-input uk-form-small" v-model="data.name" :disabled="!categoryStore.editing">
        <span v-if="categoryStore.error !== ''" v-for="error in categoryStore.error" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error[0] }}</span>  
      </div>
      <div class="uk-flex uk-flex-column uk-width-3-5 uk-margin-small-bottom">
        <label class="label">Catatan</label>
        <textarea type="" class="uk-textarea uk-form-small" v-model="data.note" :disabled="!categoryStore.editing"></textarea>
      </div>
      <div class="uk-flex uk-flex-row uk-flex-right uk-margin-medium-top">
        <button class="btn-cnl uk-margin-medium-right" @click="cancel()" v-if="categoryStore.editing">Batalkan</button>
        <button class="btn-sve uk-text-capitalize" @click="categoryStore.editCategory()" v-if="!categoryStore.editing" style="width: 75px;">edit</button>
        <button class="btn-sve" @click="categoryStore.updateCategory(data)" v-if="categoryStore.editing">Simpan</button>
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
  color: black;
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