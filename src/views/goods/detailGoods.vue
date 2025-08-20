<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref, nextTick } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { useUnitStore } from '@/stores/unit'
import { useRouter, useRoute } from 'vue-router'
import baseTable from '@/components/baseTable.vue'
import Swal from 'sweetalert2'

const goodsStore = useGoodsStore()
const categoryStore = useCategoryStore()
const unitStore = useUnitStore()
const router = useRouter()
const route = useRoute()

const data = ref({
  name: goodsStore.detailEditSelectedGoods.name || '',
  category_id: goodsStore.detailEditSelectedGoods.category_id || null,
  base_unit_id: goodsStore.detailEditSelectedGoods.base_unit_id || null,
  medium_unit_id: goodsStore.detailEditSelectedGoods.medium_unit_id || null,
  large_unit_id: goodsStore.detailEditSelectedGoods.large_unit_id || null,
  conversion_medium_to_base: goodsStore.detailEditSelectedGoods.conversion_medium_to_base || null,
  conversion_large_to_medium: goodsStore.detailEditSelectedGoods.conversion_large_to_medium || null,
  shelf_location: goodsStore.detailEditSelectedGoods.shelf_location || '',
})

function handleUpdate(){
  Swal.fire({
    title: 'Konfirmasi',
    text: "Apakah Anda yakin ingin memperbarui data barang?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await goodsStore.updateGoods(data.value)
        Swal.fire({
          title: 'Berhasil',
          text: 'Data barang berhasil diperbarui.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })    
        router.push('/goods')
      } catch (error) {
        console.error(error)
        Swal.fire({
          title: 'Gagal',
          text: error.response.data.message || 'Terjadi kesalahan saat memperbarui data barang.',
          icon: 'error',
        })
      }
    }
  })
}

const columns = [
  { key: 'batch_number', label: 'Batch' },
  { key: 'purchase_price', label: 'Harga Beli' },
  { key: 'selling_price', label: 'Harga Jual' },
  { key: 'qty', label: 'Stok' },
  { key: 'expiry_date', label: 'Tanggal Kedaluwarsa' },
  // { key: 'price', label: 'Harga' },
];


async function cancel(){
  goodsStore.editing = false
}

onMounted( async ()=>{
  goodsStore.errors = []
  goodsStore.editing = false
  if (categoryStore.categoryItems.length < 1) {
    await categoryStore.fetchCategories()    
  }
  if (unitStore.unitItems.length < 1){
    await unitStore.fetchUnits()
  }
  if (goodsStore.goodsItems.length < 1){
    await goodsStore.fetchGoods() 
  } 
  if (goodsStore.currentItemBatches.id !== parseInt(route.params.id)){
    await goodsStore.fetchCurrentItemBatches(route.params.id)
  }
    
})
</script>
<template>
  <div class="uk-width-1-1">
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/goods">
        <icon-arrow-left :size="24"/>
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        {{goodsStore.editing ?  'Edit Barang':'Detail Barang'}}
      </div>
    </div>
    <div class="uk-flex uk-flex-row uk-flex-right uk-margin-small-bottom">
      <button class="btn-cnl uk-margin-medium-right" @click="cancel()" v-if="goodsStore.editing">Batalkan</button>
      <button class="btn-sve" @click="goodsStore.editGoods()" v-if="!goodsStore.editing" style="width: 75px;">Edit</button>
      <button class="btn-sve" @click="handleUpdate()" v-if="goodsStore.editing">Simpan</button>
    </div>
    <div class="uk-flex uk-flex-between uk-margin-small-bottom">
      <div class="card uk-width-1-2 uk-margin-small-right">
        <p style="font-weight: bold;font-size: 16px;">Informasi Dasar</p>
        <div class="uk-margin-small-bottom">
          <div class="label">Nama</div>
          <input :disabled="!goodsStore.editing" type="text" class="uk-input  uk-form-small" v-model="data.name">
          <span v-if="goodsStore.error !== ''" v-for="error in goodsStore.error.name" 
          class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span>        
        </div>
        <div class="uk-margin-small-bottom">
          <div class="label">Kategori</div>
          <select :disabled="!goodsStore.editing" class=" uk-form-small uk-width-1-1" v-model="data.category_id">
            Pilih Kategori
            <option value="" class="uk-text-italic uk-text-capitalize uk-text-muted" disabled selected>Pilih Kategori</option>
            <option v-for="(category, index ) in categoryStore.categoryItems" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <span v-if="goodsStore.error !== ''" v-for="error in goodsStore.error.category_id" 
          class="uk-text-danger uk-text-small uk-text-italic uk-margin-small-left">{{ error }}</span>         
        </div>
        <div class="uk-grid-small uk-child-width-expand@s uk-margin-small-bottom" uk-grid>
          <div>
            <div class="label">Satuan Terkecil</div>
            <select :disabled="!goodsStore.editing" class="uk-text-capitalize uk-form-small uk-width-1-1" v-model="data.base_unit_id">
              <option value="null" class="uk-text-italic" disabled selected>- - Pilih Satuan - -</option>
              <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
                {{ unit.name }}
              </option>
            </select>
          </div> 
          <div>
            <div class="label">Satuan Menengah</div>
            <select :disabled="!goodsStore.editing" class="uk-text-capitalize uk-form-small uk-width-1-1" v-model="data.medium_unit_id">
              <option value="null" class="uk-text-italic" disabled selected>- - Pilih Satuan - -</option>
              <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
                {{ unit.name }}
              </option>
            </select>
          </div> 
          <div>
            <div class="label">Satuan Terkecil</div>
            <select :disabled="!goodsStore.editing" class="uk-text-capitalize uk-form-small uk-width-1-1" v-model="data.large_unit_id">
              <option value="null" class="uk-text-italic" disabled selected>- - Pilih Satuan - -</option>
              <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
                {{ unit.name }}
              </option>
            </select>
          </div> 
            
          </div>
      </div>
      <div class="card uk-width-1-2 uk-margin-small-left"> 
        <p style="font-weight: bold;font-size: 16px;color: black;">Inventori</p>
        <div class="uk-width-1-1 uk-margin-small-bottom">
          <label class="label">Isi Per Menengah</label>
          <input :disabled="!goodsStore.editing" type="number" class="uk-input uk-form-small" v-model="data.conversion_medium_to_base" placeholder="cth:1 strip isi 10 tablet">
        </div>
        <div class="uk-width-1-1 uk-margin-small-bottom">
          <label class="label">Isi Per Terbesar</label>
          <input :disabled="!goodsStore.editing" type="number" class="uk-input uk-form-small" v-model="data.conversion_large_to_medium" placeholder="cth:1 boks isi 10 strip">
        </div>
        <div class="uk-flex uk-flex-column">
          <label class="label">Rak Penyimpanan</label>
          <input :disabled="!goodsStore.editing" type="text" class="uk-input uk-form-small" v-model="data.shelf_location">
        </div>
      </div>
    </div>
    <div class="uk-margin-small-top card">
      <p style="font-weight: bold;font-size: 16px;">Informasi Batch</p>      
      <baseTable :columns="columns" :data="goodsStore.currentItemBatches.batches" class="table">
        <!-- <template #actions="{ item }">
          <button @click="goodsStore.editGoods(item)" class="uk-margin-small-right btn-edit"><IconEdit :size="18"/></button>
					<button @click="deleteGoods(item)" class="btn-del"><IconTrash :size="18"/></button>
        </template> -->
      </baseTable>
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
.table {
  margin-top: 10px;
  width: 100%;
  font-size: 12px;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 10px;
}
input:disabled, select:disabled {
  background-color: #f9f9f9 !important;
  color: #000 !important;
  cursor: default;
}
select:disabled {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: none !important;
  background-color: #f9f9f9; /* opsional, biar beda dengan enabled */
}
</style>