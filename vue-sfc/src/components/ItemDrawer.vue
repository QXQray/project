<template>
  <div class="drawer" v-if="isOpen">
    <div class="drawer-content">
      <button @click="close">Close</button>
      <h2>{{ location?.name }}</h2>
      <div v-if="items.length === 0">No items found here.</div>
      <ul v-else>
        <li v-for="item in items" :key="item.item_id">
          <p>{{ item.description }} - {{ item.status }}</p>
          <img v-if="item.photo_path" :src="item.photo_path" alt="Item photo" width="100"/>
        </li>
      </ul>
      <button @click="$emit('report-item')">Report New Item</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  location: Object,
  items: Array
});
const emit = defineEmits(['close', 'report-item']);

function close() {
  emit('close');
}
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0,0,0,0.5);
  padding: 20px;
  overflow-y: auto;
}
</style>
