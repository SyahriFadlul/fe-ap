<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref, nextTick, watch } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { useUnitStore } from '@/stores/unit'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const goodsStore = useGoodsStore()
const categoryStore = useCategoryStore()
const unitStore = useUnitStore()
const router = useRouter()

const data = ref({
  name: '',
  category_id: '',
  base_unit_id: '',
  medium_unit_id: '',
  large_unit_id: '',
  conversion_medium_to_base: '',
  conversion_large_to_medium: '',
  shelf_location: '',
})

async function cancel(){
  if (Object.values(data.value).every(value => value === '' || value == null)) { //cek data kosong atw tdk
    console.log(data.value);    
  }
  else{
    Swal.fire({
      title: 'Yakin ingin meninggalka?',
      text: `Barang: ${item.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })
  }
  
  // router.go(-1)
}

watch(data,(newVal)=>{
  if(Object.values(newVal).every(value => value === '' || value == null)){ //cek data kosong atw tdk
    console.log(newVal);
    goodsStore.hasUnsavedChanges = false
  }else{
    goodsStore.hasUnsavedChanges = true
  }
}, { deep: true })

onMounted( async ()=>{
  goodsStore.errors = []
  if (categoryStore.categoryItems.length < 1) {
    await categoryStore.fetchCategories()    
  }
  if (unitStore.unitItems.length < 1){
    await unitStore.fetchUnits()
  }
  if (goodsStore.goodsItems.length < 1){
    await goodsStore.fetchGoods() 
  } 

    
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/goods">
        <button class="btn-back uk-button uk-button-small">
          <icon-arrow-left :size="24"/>
        </button>        
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        Tambah Barang Baru
      </div>
    </div>
    <div class="card">
      <p style="font-weight: bold;font-size: 16px;">Informasi Dasar</p>
      <div class="uk-margin-small-bottom">
        <div class="label">Nama</div>
        <input type="text" class="uk-input uk-width-3-5 uk-form-small" v-model="data.name">
        <span v-if="goodsStore.error !== ''" v-for="error in goodsStore.error.name" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span>        
      </div>
      <div class="uk-margin-small-bottom">
        <div class="label">Kategori</div>
        <select class="uk-width-3-5 uk-form-small" v-model="data.category_id">
          Pilih Kategori
          <option value="" class="uk-text-italic uk-text-capitalize uk-text-muted" disabled selected>Pilih Kategori</option>
          <option v-for="(category, index ) in categoryStore.categoryItems" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <span v-if="goodsStore.error !== ''" v-for="error in goodsStore.error.category_id" 
        class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span>         
      </div>
      <p style="font-weight: bold;font-size: 16px;">Inventori</p>
      <div class="uk-flex uk-flex-between uk-width-3-5">
        <div class="uk-flex uk-flex-column unit-wrapper">
          <label class="label">Satuan Terkecil</label>
          <select class="sel-unit uk-text-capitalize uk-width-1-2 uk-form-small" v-model="data.base_unit_id">
            Pilih Satuan Terkecil
            <option value="" class="uk-text-italic" disabled selected>Pilih Satuan</option>
            <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
              {{ unit.name }}
            </option>
          </select> 
        </div>
        <div class="uk-flex uk-flex-column unit-wrapper">
          <label class="label">Satuan Menengah <span style="color: darkgrey;">(Opsional)</span></label>
          <select class="sel-unit uk-text-capitalize uk-width-1-2 uk-form-small" v-model="data.medium_unit_id">
            Pilih Satuan
            <option value="" class="uk-text-italic" disabled selected>Pilih Satuan</option>
            <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
              {{ unit.name }}
            </option>
          </select>
        </div>
        <div class="uk-flex uk-flex-column unit-wrapper">
          <label class="label" style="margin-left: 58px;">Satuan Terbesar</label>
          <select class="sel-unit uk-text-capitalize uk-margin-auto-left uk-width-1-2 uk-form-small" v-model="data.large_unit_id">
            Pilih Satuan
            <option value="" class="uk-text-italic" disabled selected>Pilih Satuan</option>
            <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
              {{ unit.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="uk-flex uk-flex-between uk-width-3-5 uk-margin-small-top">
        <div class="uk-width-1-2 uk-margin-small-right">
          <label class="label">Isi Per Menengah</label>
          <input type="number" class="uk-input uk-form-small" v-model="data.conversion_medium_to_base" placeholder="cth:1 strip isi 10 tablet">
        </div>
        <div class="uk-width-1-2 uk-margin-small-left">
          <label class="label">Isi Per Terbesar</label>
          <input type="number" class="uk-input uk-form-small" v-model="data.conversion_large_to_medium" placeholder="cth:1 boks isi 10 strip">
        </div>
      </div>
      <div class="uk-flex uk-flex-column uk-margin-small-top uk-width-3-5">
        <label class="label">Rak Penyimpanan</label>
        <input type="text" class="uk-input uk-form-small" v-model="data.shelf_location">
      </div>
      <div class="uk-flex uk-flex-row uk-flex-right uk-margin-medium-top">
        <button class="btn-cnl uk-margin-medium-right" @click="cancel()">Batalkan</button>
        <button class="btn-sve" @click="goodsStore.createGoods(data)" :disabled="goodsStore.isSubmitting">Simpan</button>
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
.btn-sve:disabled{
  background-color: #B0C4DE;
  cursor: progress;
}

.label{
  font-size: 15px;
}
input{
  font-weight: 400;
  color: rgb(34, 34, 34);
}

.unit-wrapper {
  width: 207.78px
}
.sel-unit{
  width: 150px;
}
select {
  border: 1px solid #e5e5e5;
}

select:focus {
  border: 1px solid #1e87f0;
  outline: none;             /* Hilangkan garis putus-putus dari browser */
  
  transition: .2s ease-in-out;
}
</style>