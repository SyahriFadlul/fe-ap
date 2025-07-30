<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref, watch } from 'vue'
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
import { useOutgoingGoodsStore } from '@/stores/outgoingGoods';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';

const goodsStore = useGoodsStore()
const categoryStore = useCategoryStore()
const unitStore = useUnitStore()
const supplierStore = useSupplierStore() 
const incomingGoodsStore = useIncomingGoodsStore()
const outgoingGoodsStore = useOutgoingGoodsStore()
const router = useRouter() 

function redirectToAddGoods(){
  router.push('/goods/create')
}

const rupiahNum = function (num) {
  let price = String(num);
  price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return price + ",00";
};

function handleCancel(){
  outgoingGoodsStore.clearCurrentItem()
  outgoingGoodsStore.clearCart()
  router.push({name:'outgoingGoods.index'})
}

function handleSubmit(){
  const items = outgoingGoodsStore.outgoingGoodsForm.items
  const incompleteItems = items.map((item, idx) =>(
    {...item, index:idx})
  ).filter(item => !item.batch_number || !item.unit_id || 
    !item.qty || !item.unit_price
  )
  console.log(incompleteItems);
  const date = outgoingGoodsStore.outgoingGoodsForm.date
  const transc_type = outgoingGoodsStore.outgoingGoodsForm.transc_type
  if(date === '' || transc_type === ''){
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
    title: 'Yakin ingin menyimpan transaksi ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, simpan',
    cancelButtonText: 'Batal',
  }).then(async res=>{
    if(res.isConfirmed){
      try {
        await outgoingGoodsStore.createOutgoingGoods()
        Swal.fire({
          title: 'Disimpan!',
          text: 'Transaksi Berhasil Disimpan.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        .then(async res => {
          return
          await outgoingGoodsStore.fetchOutgoingGoods(1)
          outgoingGoodsStore.clearCurrentItem()
          outgoingGoodsStore.clearCart()
          router.push({name:'outgoingGoods.index'})})
      } catch (error) {
        const message = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan transaksi. Coba lagi nanti.'  
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
  if (outgoingGoodsStore.isEditing) {
    outgoingGoodsStore.saveEditedItemToCart()
    console.log('edit');
  } else {
    outgoingGoodsStore.addItemToCart()
    console.log('tambah');
    
  }
}

function clickCallback(page){
  outgoingGoodsStore.setCartPage(page)
}

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'batch_number', label: 'Nomor Batch' },
];

const transcType = ['Retur', 'Penjualan', 'Keperluan Internal', 'Lainnya']

watch(()=>outgoingGoodsStore.selectedOutgoingGoodsItems,
  async (item) => {
    if(item && item.id){
      await goodsStore.fetchAvailableGoodsBatches(item.id)
    }
    if (item && goodsStore.inStockVueSelect.length > 0) {
      // Pilih batch pertama (FIFO)
      outgoingGoodsStore.selectedOutgoingGoodsBatch = goodsStore.inStockVueSelect[0]
    } else {
      outgoingGoodsStore.selectedOutgoingGoodsBatch = null
    }
  }
)
       

onMounted( async ()=>{
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
        <!-- <button class="btn-back uk-button uk-button-small"> -->
          <icon-arrow-left :size="24"/>
        <!-- </button>         -->
      </router-link>
      <div class="uk-text-bold uk-margin-small-left" style="font-size: 18px;">
        Tambah Data Barang Keluar Baru
      </div>
    </div>
    <div class="uk-flex uk-flex-right uk-margin-small-bottom">
      <button class="btn-cnl uk-margin-medium-right" @click="handleCancel()">Batalkan</button>
      <button class="btn-sve" @click="handleSubmit()">Simpan</button>
    </div>
    <div class="uk-flex uk-flex-between">
      <div class="uk-width-1-2"> <!--KIRI-->
        <div class="card uk-margin-small-right uk-margin-small-bottom">
          <p style="font-weight: bold;font-size: 16px;">1. Informasi Transaksi</p>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Tanggal Transaksi</label>
            <div class="uk-width-1-1">
              <VueDatePicker v-model="outgoingGoodsStore.outgoingGoodsForm.date"/>
            </div>
          </div>   
          <!-- <div class="uk-margin-small-bottom">
            <div>Nomor Faktur</div>
            <input type="text" class="uk-input uk-form-small" v-model="incomingGoodsStore.incomingGoodsForm.invoice">
          </div> -->
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <div class="label">Jenis Transaksi</div>
            <select class="uk-form-small uk-width-1-1" v-model="outgoingGoodsStore.outgoingGoodsForm.transc_type">
              <option value="null" class="uk-text-italic uk-text-capitalize" disabled selected>- - Pilih Tipe Transaksi - -</option>
              <option v-for="type in transcType" 
              :value="type">
                {{ type }}
              </option>
            </select>     
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Catatan <span class="uk-text-muted">(Opsional)</span></label>
            <textarea type="" class="uk-textarea uk-form-small" v-model="outgoingGoodsStore.outgoingGoodsForm.note"></textarea>
          </div> 
        </div>
        <div class="card uk-margin-small-right uk-margin-small-top"> <!--CARD KIRI BAWAH-->
          <p style="font-weight: bold;font-size: 16px;">2. Input Barang</p>                          
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Nama</label>
            <div class="uk-flex uk-flex-middle">
              <v-select :options="goodsStore.result" :filterable="false" label="name" v-model="outgoingGoodsStore.selectedOutgoingGoodsItems"
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
              <button class="btn-add" v-if="goodsStore.result.length < 1" uk-tooltip="Tambah jenis barang baru?" @click="redirectToAddGoods()">
                <icon-circle-plus :size="28"/>
              </button>
            </div>
          </div>          
          <div class="uk-flex uk-flex-column uk-margin-small-bottom uk-width-1-1">
            <div class="label">Nomor Batch</div>
            <v-select :options="goodsStore.inStockVueSelect" :filterable="false" label="batch_number" 
            v-model="outgoingGoodsStore.selectedOutgoingGoodsBatch" :loading="goodsStore.sloading"
            :placeholder="goodsStore.inStockVueSelect.length < 1 ? 'Kosong' : '- - Pilih Batch - -'" 
            :disabled="outgoingGoodsStore.selectedOutgoingGoodsItems === null ? true : false" class="uk-width-1-1">
              <template #no-options>
                Barang yang dipilih tidak memiliki stok yang tersedia
              </template>
              <template #options="{item}">
                <div class="uk-text-capitalize">{{ item.batch_number }}</div>
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
          </div>
          <div class="uk-grid-small uk-child-width-expand@s uk-margin-small-bottom" uk-grid>
            <div>
              <div class="label">Satuan</div>
              <select class="uk-text-capitalize uk-form-small uk-width-1-1" v-model="outgoingGoodsStore.selectedOutgoingGoods.unit_id">
                <option value="null" class="uk-text-italic" disabled selected>- - Pilih Satuan - -</option>
                <option v-for="(unit, index ) in unitStore.unitItems" :key="unit.id" :value="unit.id" class="" >
                  {{ unit.name }}
                </option>
              </select>
            </div> 
            <div>
              <div class="label">Jumlah</div>
              <input type="number" class="uk-input uk-form-small" v-model="outgoingGoodsStore.selectedOutgoingGoods.qty">
            </div>
          </div>
          <div class="uk-flex uk-flex-column uk-margin-small-bottom">
            <label class="label">Harga Per Satuan</label>
            <input type="number" placeholder="Rp.00,00-" class="uk-input uk-form-small uk-width-1-1" v-model="outgoingGoodsStore.selectedOutgoingGoods.unit_price">
          </div>          
          <div class="uk-margin uk-flex uk-flex-between">
            <button v-if="outgoingGoodsStore.isEditing" class="btn-cnl-edit"
            @click="() => {
              outgoingGoodsStore.clearCurrentItem()
              outgoingGoodsStore.editingTempId = null
            }"
            type="button"
            >
            Batal Edit
            </button>
            <button class="btn-tocart uk-margin-auto-left" @click="handleEditOrAdd" type="button" 
            :disabled="outgoingGoodsStore.selectedOutgoingGoodsItems === null || 
            outgoingGoodsStore.selectedOutgoingGoodsBatch === null ? true : false">
              {{ outgoingGoodsStore.isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar' }}
            </button>
          </div>
        </div>
      </div>
      <div class="card uk-width-expand uk-margin-small-left" style="max-height: 600px;"> <!--KANAN-->
        <p style="font-weight: bold;font-size: 16px;">3. Ringkasan Barang Keluar</p>        
        <baseTable :columns="columns" :data="outgoingGoodsStore.paginatedCart" :min-rows="10" :action-col-width="'120px'" class="table">
          <template #actions="{ item }">
            <button @click="outgoingGoodsStore.editItemFromCart(item)" class="uk-margin-small-right btn-edit"><IconEdit :size="18"/></button>
            <button @click="outgoingGoodsStore.removeItemFromCart(item)" class="btn-del"><IconTrash :size="18"/></button>
          </template>
        </baseTable>
        <div v-if="outgoingGoodsStore.cartTotalPage > 1">
          <paginate
          v-model="outgoingGoodsStore.cartPagination.currentPage"
          :page-count="outgoingGoodsStore.cartTotalPage"
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
          Total : Rp.{{ rupiahNum(outgoingGoodsStore.totalAmount) }}
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
  border-radius: 8px;
}
.btn-cnl {
  padding: 2px !important;
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

</style>