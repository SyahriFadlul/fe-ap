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
import Swal from 'sweetalert2';

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
  unit_price: '',
  expiry_date: '',
})

function redirectToAddGoods(){
  router.push('/goods/create')
}

function onSelectGoods(item) {
  incomingGoodsStore.selectedIncomingGoods.name = item.name
  incomingGoodsStore.selectedIncomingGoods.id = item.id
 console.log(item);
 
}

const rupiahNum = function (num) {
  let price = String(num);
  price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return price + ",00";
};

function goBack(){
  incomingGoodsStore.clearCurrentItem()
  incomingGoodsStore.clearCart()
  router.push({name:'incomingGoods.index'})
}

function cancel(){
  incomingGoodsStore.editing = false
}

function handleSubmit(){
  const items = incomingGoodsStore.incomingGoodsForm.items
  const incompleteItems = items.map((item, idx) =>(
    {...item, index:idx})
  ).filter(item => !item.batch_number || !item.conversion_qty || !item.expiry_date || 
    !item.unit_id || !item.qty || !item.unit_price
  )
  console.log(incompleteItems);
  const inv = incomingGoodsStore.incomingGoodsForm.invoice
  const rcv_date = incomingGoodsStore.incomingGoodsForm.received_date
  const supp = incomingGoodsStore.incomingGoodsForm.supplier_id
  if(inv === '' || rcv_date === '' || supp === null){
    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      html: 'Mohon lengkapi data informasi transaksi',
    })
    return
  }
  if (incompleteItems.length > 0) {
    const maxDisplay = 5
    const displayedItems = incompleteItems.slice(0, maxDisplay)
    const hiddenCount = incompleteItems.length - maxDisplay

    let listHtml = '<ul style="text-align:left">'
    listHtml += displayedItems.map(item =>
      `<li>${item.name || 'Item ke-' + (item.index + 1)} belum lengkap</li>`
    ).join('')
    listHtml += '</ul>'

    if (hiddenCount > 0) {
      listHtml += `<div class="uk-text-muted uk-text-small" style="margin-top: 8px;">
        ...dan ${hiddenCount} item lainnya masih belum lengkap.</div>`
    }

    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      html: `Mohon lengkapi data berikut sebelum menyimpan:${listHtml}`,
    })
    return
  }
  Swal.fire({
    title: 'Yakin ingin mengubah transaksi ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, simpan',
    cancelButtonText: 'Batal',
  }).then(async res=>{
    if(res.isConfirmed){
      try {
        await incomingGoodsStore.updateIncomingGoods()
        Swal.fire({
          title: 'Diubah!',
          text: 'Transaksi Berhasil Diubah.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        .then(async res => {
          await incomingGoodsStore.getIncomingGoodsData(1)
          incomingGoodsStore.clearCurrentItem()
          incomingGoodsStore.clearCart()
          router.push({name:'incomingGoods.index'})})
      } catch (error) {
        const message = error.response?.data?.error || 'Terjadi kesalahan saat mengubah transaksi. Coba lagi nanti.'  
        Swal.fire({
          title: 'Gagal!',
          text: message,
          icon: 'error',
        })
      }
    }
  })
}

function handleEditOrAdd() {
  if (incomingGoodsStore.isEditing) {
    incomingGoodsStore.saveEditedItemToCart()
  } else {
    incomingGoodsStore.addItemToCart()
    console.log('tambah');
    
  }
}

function clickCallback(page){
  incomingGoodsStore.setCartPage(page)
}

const columns = [
  { key: 'goods', label: 'Nama' },
  { key: 'batch_number', label: 'Nomor Batch' },
];
       

onMounted( async ()=>{
  incomingGoodsStore.errors = []
  if (categoryStore.categoryItems.length < 1){
    await categoryStore.fetchCategories()
  }
  if (unitStore.unitItems.length < 1){
    await unitStore.fetchUnits()
  }
  if (goodsStore.goodsItems.length < 1){
    await goodsStore.fetchGoods() 
  } 
  if (supplierStore.supplierItems.length < 1){
    await supplierStore.fetchSuppliers() 
  } 
})
</script>
<template>
  <div>
    <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
      <router-link to="/incoming-goods">
        <button class="btn-back" @click="goBack()">
          <icon-arrow-left :size="24"/>
        </button>        
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        {{ incomingGoodsStore.editing ? 'Ubah Data Barang Masuk':'Detail Data Barang Masuk' }}
      </div>
    </div>
    <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-bottom">
      <div>
        <div class="uk-text-danger uk-text-small" v-if="incomingGoodsStore.errors.length > 0">*{{ incomingGoodsStore.errors }}</div>
      </div>
      <div class="uk-flex uk-flex-middle">
        <button class="btn-cnl uk-margin-medium-right" @click="cancel()" v-if="incomingGoodsStore.editing">Batalkan</button>
        <button class="btn-sve uk-text-capitalize" @click="incomingGoodsStore.editIncomingGoods()" 
        v-if="!incomingGoodsStore.editing" style="width: 75px;">edit</button>
        <button class="btn-sve" @click="handleSubmit()" v-if="incomingGoodsStore.editing">Simpan</button>
      </div>
    </div>
    <div class="uk-flex uk-flex-between">
      <div class="uk-width-1-2"> <!--KIRI-->
        <div class="card uk-margin-small-right uk-margin-small-bottom">
          <p style="font-weight: bold;font-size: 16px;">1. Informasi Transaksi</p>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Tanggal Penerimaan</label>
            <div class="uk-width-1-1">
              <VueDatePicker v-model="incomingGoodsStore.incomingGoodsForm.received_date" :disabled="!incomingGoodsStore.editing"/>
            </div>
          </div>   
          <div class="uk-margin-small-bottom">
            <div>Nomor Faktur</div>
            <input type="text" class="uk-input uk-form-small" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.incomingGoodsForm.invoice">            
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <div class="label">Supplier</div>
            <select class="uk-form-small uk-width-1-1" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.incomingGoodsForm.supplier_id">
              <option value="null" class="uk-text-italic uk-text-capitalize" disabled selected>- - Pilih Supplier - -</option>
              <option v-for="(supplier, index ) in supplierStore.supplierItems" :key="supplier.id" 
              :value="supplier.id" >
                {{ supplier.name }}
              </option>
            </select>     
          </div> 
        </div>
        <div class="card uk-margin-small-right uk-margin-small-top"> <!--CARD KIRI BAWAH-->
          <p style="font-weight: bold;font-size: 16px;">2. Input Barang</p>                          
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Nama</label>
            <div class="uk-flex uk-flex-middle">
              <v-select :options="goodsStore.result" :filterable="false" label="goods" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.selectedIncomingGoodsItems"
                @search="goodsStore.getSelectSearch" placeholder="ketik untuk mencari barang" :loading="goodsStore.sloading" class="uk-width-1-1 v-sel">
                <template #no-options>
                  ketik untuk mencari barang..
                </template>
                <template #options="{item}">
                  <div class="uk-text-capitalize">{{ item.goods }}</div>
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
              <button class="btn-add" v-if="goodsStore.result.length < 1" uk-tooltip="Tambah jenis barang baru?" @click="redirectToAddGoods()">
                <icon-circle-plus :size="28"/>
              </button>
            </div>
          </div>          
          <div class="uk-flex uk-flex-column uk-margin-small-bottom uk-width-1-1">
            <div class="label">Nomor Batch</div>
            <input type="text" class="uk-form-small" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.selectedIncomingGoods.batch_number">   
          </div>
          <div class="uk-grid-small uk-child-width-expand@s uk-margin-small-bottom" uk-grid>
            <div>
              <div class="label">Satuan</div>
              <select class="uk-text-capitalize uk-form-small uk-width-1-1" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.selectedIncomingGoods.unit_id">
                <option value="null" class="uk-text-italic" disabled selected>- - Pilih Satuan - -</option>
                <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
                  {{ unit.name }}
                </option>
              </select>
            </div> 
            <div>
              <div class="label">Jumlah</div>
              <input type="number" class="uk-input uk-form-small" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.selectedIncomingGoods.qty">
            </div>
            <div>
              <div class="label" uk-tooltip="Misalnya 1 boks 10 strip">Isi Per Satuan</div>
              <input type="number" class="uk-form-small input-conv uk-width-1-1" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.selectedIncomingGoods.conversion_qty" 
              placeholder="cth:1 boks,10 strip">
            </div>
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Harga Per Satuan</label>
            <input type="number" placeholder="Rp.00,00-" class="uk-input uk-form-small uk-width-1-1" :disabled="!incomingGoodsStore.editing" v-model="incomingGoodsStore.selectedIncomingGoods.unit_price">
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Tanggal Kedaluwarsa</label>
            <div class="uk-width-1-1">
              <VueDatePicker v-model="incomingGoodsStore.selectedIncomingGoods.expiry_date" :disabled="!incomingGoodsStore.editing"/>
            </div>
          </div>
          <div class="uk-margin uk-flex uk-flex-between">
            <button v-if="incomingGoodsStore.isEditing" class="btn-cnl-edit"
            @click="() => {
              incomingGoodsStore.clearCurrentItem()
              incomingGoodsStore.editingTempId = null
            }"
            type="button"
            >
            Batal Edit
            </button>
            <button class="btn-tocart uk-margin-auto-left" @click="handleEditOrAdd" type="button" 
            :disabled="incomingGoodsStore.selectedIncomingGoodsItems === null || 
            incomingGoodsStore.selectedIncomingGoods?.batch_number === '' ? true : false">
              {{ incomingGoodsStore.isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar' }}
            </button>
          </div>
        </div>
      </div>
      <div class="card uk-width-expand uk-margin-small-left" style="max-height: 600px;"> <!--KANAN-->
        <p style="font-weight: bold;font-size: 16px;">3. Ringkasan Barang Masuk</p>        
        <baseTable :columns="columns" :data="incomingGoodsStore.paginatedCart" :min-rows="10" :action-col-width="'120px'" class="table">
          <template #actions="{ item }">
            <button @click="incomingGoodsStore.editItemFromCart(item)" class="uk-margin-small-right btn-edit"><IconEdit :size="18"/></button>
            <button @click="incomingGoodsStore.removeItemFromCart(item)" class="btn-del"><IconTrash :size="18"/></button>
          </template>
        </baseTable>
        <div v-if="incomingGoodsStore.cartTotalPage > 1">
          <paginate
          v-model="incomingGoodsStore.cartPagination.currentPage"
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
        <div class="" style="font-size: 20px;font-weight: 500;">
          Total : Rp.{{ rupiahNum(incomingGoodsStore.totalAmount) }}
        </div>
      </div>
      <div>
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
  color: #1E87F0;
  /* border-radius: 8px; */
  background-color: transparent;
}
.btn-back:hover{
  color: #0F7AE5;
}
.btn-cnl {
  padding: 10px !important;
  width: 120px;
  border: none;
  border-radius: 8px;
  background-color: #E5E5E5;
}
.btn-cnl:hover{
  background-color: #D5D5D5;
}
.btn-sve {
  padding: 10px 5px;
  width: 130px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #1E87F0;
}
.btn-sve:hover{
  background-color: #0F7AE5;
}
.btn-cnl-edit{
  border: none;
  border-radius: 8px;
  padding: 10px;
  background-color: #E5E5E5;
}
.btn-cnl-edit:hover{
  background-color: #D5D5D5;
}
.btn-tocart{
  padding: 10px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #1E87F0; /*1E87F0  0F7AE5*/
}
.btn-tocart:hover{
  background-color: #0F7AE5;
}
.btn-tocart:disabled{
  background-color: #D5D5D5;
  cursor: not-allowed;
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
.input-conv:placeholder-shown{
  font-size: 10px;
}
.qty-unit-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px; /* jarak antar item tengah-kiri dan tengah-kanan */
  width: 100%;
}
/* .qty-unit {
  width: 150px;
} */
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

.vs__search::placeholder {
  font-style: italic;
}
</style>