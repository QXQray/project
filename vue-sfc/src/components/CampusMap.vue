<template>
  <div class="map-wrapper">
    <div class="map-container">
      <img src="/school_map.jpg" class="school-map" alt="Campus Map" />
      
      <div 
        v-for="loc in locations" 
        :key="loc.location_id"
        class="pin"
        :style="{ left: loc.x_coordinate + '%', top: loc.y_coordinate + '%' }"
      >
        <Transition name="bounce">
          <img 
            v-if="selectedLocation?.location_id === loc.location_id" 
            src="/landmark.png" 
            class="pin-icon" 
            alt="Landmark" 
          />
        </Transition>

        <span 
          class="pin-label" 
          :class="{ 'is-selected': selectedLocation?.location_id === loc.location_id }"
          @click="handlePinClick(loc)"
        >
          {{ loc.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  locations: { type: Array, required: true },
  selectedLocation: { type: Object, default: null } // 接收目前點擊的建築物
});
const emit = defineEmits(['pin-click']);

function handlePinClick(loc) {
  emit('pin-click', loc);
}
</script>

<style scoped>
.map-wrapper {
  background: var(--card-bg);
  padding: 16px;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}
.map-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
.school-map { width: 100%; height: auto; display: block; }
.pin {
  position: absolute;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

/* 圖標樣式 (預設隱藏，由 Vue 控制出現) */
.pin-icon {
  width: 32px;
  height: auto;
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); 
}

/* 文字標籤樣式 (主要的互動區域) */
.pin-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease; /* 平滑過渡效果 */
}

/* ✅ 需求 3：滑鼠移上去的動態回饋 */
.pin-label:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-3px) scale(1.05); /* 稍微向上浮起並放大 */
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 10;
}

/* 被點擊選中時的樣式 */
.pin-label.is-selected {
  background: var(--secondary-color);
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 5;
}

/* 圖標彈出的動畫 */
.bounce-enter-active { animation: bounce-in 0.4s; }
.bounce-leave-active { animation: bounce-in 0.3s reverse; }
@keyframes bounce-in {
  0% { transform: scale(0) translateY(10px); opacity: 0; }
  60% { transform: scale(1.1) translateY(-2px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
</style>