<template>
  <div class="info-panel">
   
  </div>
</template>

<script>
export default {
  name: 'MaterialInfoPanel',
  props: ['category', 'density', 'quantity', 'volume']
};
</script>

<style scoped>
.info-panel { padding: 16px; background-color: #f5f5f5; border-radius: 8px; }
</style>
