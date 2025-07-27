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

onMounted( async ()=>{
  categoryStore.errors = []
  if (categoryStore.categoryItems.length < 1){
    await categoryStore.getCategories()
  }
  if (unitStore.unitItems.length < 1){
    await unitStore.getUnits()
  }  
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
        <button class="btn-back uk-button uk-button-small" @click="cancel">
          <icon-arrow-left :size="24"/>
        </button>        
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

.btn-cnl {
  padding: 10px 5px;
  width: 130px;
  border: none;
  border-radius: 8px;
}

.btn-sve {
  padding: 10px 5px;
  width: 130px;
  border: none;
  border-radius: 8px;
  color: rgb(2, 29, 16);
  background-color: #58F566;
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