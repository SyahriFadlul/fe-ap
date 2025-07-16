<template>
    <div class="uk-flex uk-flex-between" v-for="card in cards" :key="card.title">
        <div class="info-card">
            <IconBox :size="36" :stroke-width="1.2"/>
            <div class="ttl-info">{{ card.title }}</div>
            <div class="num-info">{{ card.value }}</div>
        </div>
    </div>
</template>
<script setup>
defineProps({
  cards: {
    type: Array,
    default: () => ([
      {
          title: 'Info Card',
          icon: 'IconBox',
          value: 0
      }
    ])
  }
});
</script>
<style scoped>

</style>