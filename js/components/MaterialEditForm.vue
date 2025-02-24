<template>
  <div class="edit-form">
    <h2>编辑材料</h2>
    <form @submit.prevent="submitForm">
      <label>类别:<input v-model="category" /></label>
      <label>密度:<input v-model="density" type="number" /></label>
      <label>数量:<input v-model="quantity" type="number" /></label>
      <label>体积:<input v-model="volume" type="number" /></label>
      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MaterialEditForm',
  props: ['material'],
  data() {
    return { category: '', density: 0, quantity: 0, volume: 0 };
  },
  methods: {
    submitForm() {
      this.$emit('update', {
        category: this.category,
        density: this.density,
        quantity: this.quantity,
        volume: this.volume
      });
    }
  }
};
</script>

<style scoped>
.edit-form { padding: 16px; background-color: #fff; border-radius: 8px; }
</style>
