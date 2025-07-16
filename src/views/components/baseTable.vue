<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          <th v-if="$slots.actions" style="width: 150px;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-cell">
            Tidak ada data.
          </td>
        </tr>
        <tr v-for="(item, index) in data" :key="item.id || index" class="row-tbl">
          <td v-for="col in columns" :key="col.key" class="uk-text-capitalize">{{ item[col.key] }}</td>
          <td v-if="$slots.actions" style="width: 150px;">
            <slot name="actions" :item="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // Contoh: [{ key: 'name', label: 'Nama Barang' }]
  },
  data: {
    type: Array,
    required: true,
  },
});
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
  min-width: 700px; /* agar tidak menyusut */
}

/* Header */

.custom-table th {
  padding: 12px 12px;
  text-align: left;
  font-weight: 600;
  background-color: #f0f0ff !important;
  color: black;
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
