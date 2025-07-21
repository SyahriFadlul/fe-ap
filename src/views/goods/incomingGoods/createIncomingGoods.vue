<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { IconArrowLeft, IconCirclePlus, IconEdit, IconTrash, IconChevronsRight } from '@tabler/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { useUnitStore } from '@/stores/unit'
import vSelect from 'vue-select'
import baseTable from '@/components/baseTable.vue'
import { useSupplierStore } from '@/stores/supplier'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useIncomingGoodsStore } from '@/stores/incomingGoods'
import Paginate from 'vuejs-paginate-next';

const goodsStore = useGoodsStore()
const categoryStore = useCategoryStore()
const unitStore = useUnitStore()
const supplierStore = useSupplierStore() 
const incomingGoodsStore = useIncomingGoodsStore()
const router = useRouter() 
const date = ref()
const details = ref({
  supplier_id: '',
  batch_number: '',
  qty: '',
  unit_id: '',
  price_per_line: '',
  expiry_date: '',
})

function redirectToAddGoods(){
  router.push('/goods/create')
}

function clickCallback(page){
  incomingGoodsStore.setCartPage(page)
}

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'batch_number', label: 'Nomor Batch' },
];
       

onMounted( async ()=>{
  if (categoryStore.categoryItems.length < 1){
    await categoryStore.getCategories()
  }
  if (unitStore.unitItems.length < 1){
    await unitStore.getUnits()
  }
  if (goodsStore.goodsItems.length < 1){
    await goodsStore.getGoods() 
  } 
  if (supplierStore.supplierItems.length < 1){
    await supplierStore.getSuppliers() 
  } 
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/incoming-goods">
        <button class="btn-back uk-button uk-button-small">
          <icon-arrow-left :size="24"/>
        </button>        
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        Tambah Barang Masuk Baru
      </div>
    </div>
    <div class="card">
      <div class="uk-flex uk-flex-between">
        <div class="uk-width-3-4">                           <!--KIRI-->
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Nama</label>
            <div class="uk-flex uk-flex-middle">
              <v-select :options="goodsStore.result" :filterable="false" label="name" v-model="incomingGoodsStore.selectedIncomingGoods"
                @search="goodsStore.getSelectSearch" :loading="goodsStore.sloading" class="uk-width-1-1">
                <template #no-options>
                  ketik untuk mencari barang..
                </template>
                <template #options="{item}">
                  <div class="uk-text-capitalize">{{ item.name }}</div>
                </template>
                <template #spinner="{ loading }">
                  <div
                    v-if="loading"
                    style="border-left-color: rgba(88, 151, 251, 0.71)"
                    class="vs__spinner"
                  >
                  </div>
                </template>              
              </v-select>
              <button class="btn-add" v-if="goodsStore.result.length < 1" uk-tooltip="Tambah barang baru?" @click="redirectToAddGoods()">
                <icon-circle-plus :size="28"/>
              </button>
            </div>
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <div class="label">Supplier</div>
            <select class="uk-form-small uk-width-1-1" v-model="incomingGoodsStore.selectedIncomingGoods.supplier_id">
              <option value="null" class="uk-text-italic uk-text-capitalize" disabled selected>- - Pilih Supplier - -</option>
              <option v-for="(supplier, index ) in supplierStore.supplierItems" :key="supplier.id" :value="supplier.id">
                {{ supplier.name }}
              </option>
            </select>     
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom uk-width-1-1">
            <div class="label">Nomor Batch</div>
            <input type="text" class="uk-form-small" v-model="incomingGoodsStore.selectedIncomingGoods.batch_number">   
          </div>
          <div class="uk-flex uk-flex-between uk-width-1-1">
            <div class="uk-flex ">
              <div class="uk-flex uk-flex-column">
                <label class="label">Jumlah</label>
                <input type="text" class="uk-input uk-form-small" v-model="incomingGoodsStore.selectedIncomingGoods.qty">
              </div>
            </div>
            <div class="uk-flex uk-flex-column unit-wrapper uk-margin-small-bottom uk-margin-left">
              <label class="label">Satuan</label>
              <select class="uk-text-capitalize uk-width-3-4 uk-form-small" v-model="incomingGoodsStore.selectedIncomingGoods.unit_id">
                <option value="null" class="uk-text-italic" disabled selected>- - Pilih Satuan - -</option>
                <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
                  {{ unit.name }}
                </option>
              </select>
            </div> 
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Harga Per Satuan</label>
            <input type="text" class="uk-input uk-form-small uk-width-1-1" v-model="incomingGoodsStore.selectedIncomingGoods.price_per_line">
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Tanggal Kedaluwarsa</label>
            <div class="uk-width-1-1">
              <VueDatePicker v-model="incomingGoodsStore.selectedIncomingGoods.expiry_date"/>
            </div>
          </div>
        </div>
        <div class="uk-flex uk-flex-middle uk-margin-medium-left" style="width: 100px;">     <!--TENGAH-->
        <button class="btn-chev" @click="incomingGoodsStore.btnAddItemToCart()" 
          :disabled="incomingGoodsStore.btnAbleToAdd">
          <IconChevronsRight />
        </button>
        </div>
        <div class="uk-width-3-4 uk-margin-auto-right">    <!--KANAN-->
          <baseTable :columns="columns" :data="incomingGoodsStore.paginatedCart" :action-col-width="'120px'" class="table">
            <template #actions="{ item }">
              <button @click="edit(item)" class="uk-margin-small-right btn-edit"><IconEdit :size="18"/></button>
              <button @click="remove(item)" class="btn-del"><IconTrash :size="18"/></button>
            </template>
          </baseTable>
            <paginate
              :page-count="incomingGoodsStore.cartTotalPage"
              :page-range="3"
              :margin-pages="3"
              :click-handler="clickCallback"
              :prev-text="'Sebelumnya'"
              :next-text="'Selanjutnya'"
              :container-class="'pagination'"
              :page-class="'page-item'"
            />
        </div>
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
.btn-add{
  margin-left: 5px;
  border: none;
}
.btn-chev{
  border: none;
}
.btn-chev:disabled{
  cursor: not-allowed;
}
.label{
  font-size: 15px;
}
.unit-wrapper {
  width: 300px;
}
.pagination {
  display: flex;
  margin: 0.25rem 0.25rem 0;
}
.pagination button {
  flex-grow: 1;
}
.pagination button:hover {
  cursor: pointer;
}
.table{
  width: 100%;
}
.lyout-right{
  width: 900px;
}
</style>