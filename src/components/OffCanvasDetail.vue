<template>
  <div :id="canvasId" uk-offcanvas="flip: true; overlay: true">
    <div class="uk-offcanvas-bar uk-flex uk-flex-column">

      <!-- Header -->
      <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-small-bottom">
        <h4 class="uk-margin-remove title">{{ title }}</h4>
        <button class="uk-offcanvas-close btn-close" type="button" uk-close></button>
      </div>

      <!-- Static form area -->
      <div class="uk-form-stacked uk-grid-small" uk-grid>
        <template v-for="(row, index) in formRows" :key="index">
          <div v-for="(field, i) in row.fields" :key="i" :class="getColumnClass(row.fields.length)">
            <label class="uk-form-label labels">{{ field.label }}</label>
            <div class="uk-form-controls">
              <component :is="field.component" v-bind="field.props" />
            </div>
          </div>
        </template>
      </div>

      <!-- Optional Scrollable Table -->
      <div v-if="showTable" class="uk-margin-top uk-overflow-auto table" style="max-height: 300px; overflow: auto;">
        <slot name="table" />
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  canvasId: { type: String, required: true },
  title: { type: String, default: 'Detail' },

  /** 
   * formRows: Array of row configs:
   * [
   *   { fields: [ { label: 'Nama', component: 'input', props: { type: 'text', value: '...' } }, ... ] },
   *   ...
   * ]
   */
  formRows: { type: Array, default: () => [] },

  showTable: { type: Boolean, default: false },
})

const getColumnClass = (count) => {
  switch (count) {
    case 1: return 'uk-width-1-1';
    case 2: return 'uk-width-1-2@s';
    case 3: return 'uk-width-1-3@s';
    default: return 'uk-width-1-1';
  }
}
</script>
<style scoped>
.uk-offcanvas-bar{
	padding: 0;
	background-color: white;
	color: black !important;
}
.title, .btn-close, .labels, .table > td{
	color: pink !important
}

</style>
