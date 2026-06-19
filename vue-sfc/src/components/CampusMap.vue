<template>
  <div class="map-container">
    <img src="/school_map.jpg" class="school-map" alt="Campus Map" />
    <div 
      v-for="loc in locations" 
      :key="loc.location_id"
      class="pin"
      :style="{ left: loc.x_coordinate + '%', top: loc.y_coordinate + '%' }"
      @click="handlePinClick(loc)"
    >
      <img src="/landmark.jpg" class="pin-icon" alt="Pin" />
      <span class="pin-label">{{ loc.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  locations: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['pin-click']);

function handlePinClick(loc) {
  emit('pin-click', loc);
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.school-map {
  width: 100%;
  height: auto;
  display: block;
}
.pin {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  text-align: center;
}
.pin-icon {
  width: 24px;
  height: auto;
}
.pin-label {
  display: block;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
