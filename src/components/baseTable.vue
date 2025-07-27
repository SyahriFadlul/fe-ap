<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          <th v-if="$slots.actions" :style="{ width:actionColWidth }">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data || data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-cell">
            Tidak ada data.
          </td>
        </tr>
        <!-- <tr v-for="(item, index) in data" :key="item.id || index" class="row-tbl" @click="$emit('row-click', item)">
          <td v-for="col in columns" :key="col.key" class="uk-text-capitalize">
            <slot :name="col.key" :item="item">
              {{ item[col.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" style="width: 150px;">
            <slot name="actions" :item="item" />
          </td>
        </tr> -->
        <tr v-for="(item, index) in paddedData" :key="item.id || 'empty-' + index" class="row-tbl" @click="!item.__empty && $emit('row-click', item)">
          <td v-for="col in columns" :key="col.key" class="uk-text-capitalize">
            <template v-if="item.__empty">
              &nbsp;
            </template>
            <slot v-else :name="col.key" :item="item">
              {{ item[col.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" style="width: 150px;">
            <template v-if="!item.__empty">
              <slot name="actions" :item="item" />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // Contoh: [{ key: 'name', label: 'Nama Barang' }]
  },
  data: {
    type: Array,
    required: true,
  },
  actionColWidth: {
    type: String,
    default:'150px'
  },
  minRows: {
    type: Number,
    defauit: 0,
  }
});
const paddedData = computed(() => {
  const actualData = props.data || []
  const result = [...actualData]

  while (result.length < props.minRows) {
    result.push({ __empty: true })
  }

  return result
})
</script>

<style scoped>
/* Kontainer scroll horizontal */
.table-container {
  overflow-x: auto;
  width: 50%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Tabel */
.custom-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 14px;
   /* agar tidak menyusut */
}

/* Header */

.custom-table th {
  padding: 12px 12px;
  text-align: left;
  font-weight: 600;
  background-color: #888891 !important;
  color: white;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  box-sizing: border-box;
}

/* Body */
.custom-table td {
  padding: 5px 12px;
  border-bottom: 1px solid #eee;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  cursor: pointer;
}

/* Hover row */
.row-tbl:hover {
  background-color: #f9faff;
  transition: background-color 0.2s ease-in-out;
}

/* Empty row */
.empty-cell {
  text-align: center;
  padding: 24px;
  color: #888;
  font-style: italic;
}

/* Optional: Responsive tweak for small screen */
@media (max-width: 768px) {
  .custom-table th,
  .custom-table td {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
