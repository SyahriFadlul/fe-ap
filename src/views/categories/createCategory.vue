<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref, nextTick } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { useUnitStore } from '@/stores/unit'

const goodsStore = useGoodsStore()
const categoryStore = useCategoryStore()
const unitStore = useUnitStore()

onMounted( async ()=>{
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
      <router-link to="/goods">
        <button class="btn-back uk-button uk-button-small">
          <icon-arrow-left :size="24"/>
        </button>        
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        Tambah Kategori Baru
      </div>
    </div>
    <div class="card">
      <p style="font-weight: bold;font-size: 16px;">Informasi Dasar</p>
      <div class="uk-flex uk-flex-column uk-width-3-5 uk-margin-small-bottom">
        <label class="label">Nama</label>
        <input type="text" class="uk-input uk-form-small">
      </div>
      <div class="uk-flex uk-flex-column uk-margin-small-bottom">
        <div class="label">Kategori</div>
        <select class=" uk-width-1-2 uk-form-small">
          Pilih Kategori
          <option value="null" class="uk-text-italic uk-text-capitalize" disabled>Pilih Kategori</option>
          <option v-for="(category, index ) in categoryStore.categoryItems" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>     
      </div>
      <p style="font-weight: bold;font-size: 16px;">Inventori</p>
      <div class="uk-flex uk-flex-between uk-width-3-5">
        <div class="uk-flex uk-flex-column unit-wrapper">
          <label class="label">Satuan Terkecil</label>
          <select class="uk-text-capitalize uk-width-1-2 uk-form-small">
            Pilih Satuan Terkecil
            <option value="null" class="uk-text-italic" disabled>Pilih Satuan</option>
            <option value="null">-- Pilih --</option>
            <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.name" class="" >
              {{ unit.name }}
            </option>
          </select> 
        </div>
        <div class="uk-flex uk-flex-column unit-wrapper">
          <label class="label">Satuan Menengah <span style="color: darkgrey;">(Opsional)</span></label>
          <select class="uk-text-capitalize uk-width-1-2 uk-form-small">
            Pilih Satuan
            <option value="null" class="uk-text-italic" disabled>Pilih Satuan</option>
            <option value="null">-- Pilih --</option>
            <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.name" class="" >
              {{ unit.name }}
            </option>
          </select>
        </div>
        <div class="uk-flex uk-flex-column unit-wrapper">
          <label class="label" style="margin-left: 58px;">Satuan Terbesar</label>
          <select class="uk-text-capitalize uk-margin-auto-left uk-width-1-2 uk-form-small">
            Pilih Satuan
            <option value="null" class="uk-text-italic" disabled>Pilih Satuan</option>
            <option value="null">-- Pilih --</option>
            <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.name" class="" >
              {{ unit.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="uk-flex uk-margin-small-top">
        <div class="uk-flex uk-flex-column">
          <label class="label">Isi Per Menengah</label>
          <input type="text" class="uk-input uk-form-small">
        </div>
        <div class="uk-flex uk-flex-column uk-margin-xlarge-left">
          <label class="label">Isi Per Terbesar</label>
          <input type="text" class="uk-input uk-form-small">
        </div>
      </div>
      <div class="uk-flex uk-flex-column uk-margin-small-top uk-width-3-5">
        <label class="label">Rak Penyimpanan</label>
        <input type="text" class="uk-input uk-form-small">
      </div>
      <div class="uk-flex uk-flex-row uk-flex-right uk-margin-medium-top">
        <button class="btn-cnl uk-margin-medium-right">Batalkan</button>
        <button class="btn-sve">Simpan</button>
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