<template>
  <div class="marker-edit-form">
    
  </div>
</template>

<script>
export default {
  name: 'MarkerEditForm',
  props: ['marker'],
  data() {
    return { name: '', lat: 0, lng: 0 };
  },
  methods: {
    updateMarker() {
      this.$emit('update-marker', { name: this.name, lat: this.lat, lng: this.lng });
    }
  }
};
</script>

<style scoped>
.marker-edit-form { padding: 16px; background-color: #f0f0f0; border-radius: 8px; }
</style>
