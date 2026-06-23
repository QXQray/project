<template>
  <div class="map-wrapper">
    <div class="map-container" @click="handleMapClick" @mousemove="updateMousePosition">
      <img src="/school_map.jpg" class="school-map" alt="Campus Map" />
      
      <div 
        v-for="loc in locations" 
        :key="loc.location_id"
        class="hitbox"
        :class="{ 'is-selected': selectedLocation?.location_id === loc.location_id }"
        :style="{ 
          left: loc.x1 + '%', 
          top: loc.y1 + '%', 
          width: (loc.x2 - loc.x1) + '%', 
          height: (loc.y2 - loc.y1) + '%' 
        }"
        @mouseenter="hoveredLocation = loc"
        @mouseleave="hoveredLocation = null"
      ></div>

      <Transition name="bounce">
        <img 
          v-if="clickPos" 
          src="/landmark.png" 
          class="pin-icon" 
          :style="{ left: clickPos.x + '%', top: clickPos.y + '%' }"
          alt="Landmark" 
        />
      </Transition>
    </div>

    <div 
      v-if="hoveredLocation" 
      class="hover-tooltip" 
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
    >
      <h4 class="tooltip-title">📌{{ hoveredLocation.name }}</h4>
      <img :src="'/' + hoveredLocation.name + '.jpg'" class="tooltip-img" alt="地點照片" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  locations: { type: Array, required: true },
  selectedLocation: { type: Object, default: null }
});
const emit = defineEmits(['pin-click']);

// 紀錄使用者實際點擊的座標，用來顯示地標
const clickPos = ref(null);

// 用來處理懸停狀態與游標位置
const hoveredLocation = ref(null);
const mouseX = ref(0);
const mouseY = ref(0);

// 更新 tooltip 的位置，稍微位移以防擋住游標
function updateMousePosition(event) {
  const offset = 15; 
  let x = event.clientX + offset;
  let y = event.clientY + offset;

  // 根據你下方的 CSS，提示框寬度是 160px + 內邊距，高度大約 150px
  // 我們抓個安全距離：寬度 200，高度 180
  const tooltipWidth = 200; 
  const tooltipHeight = 180; 

  // 🛡️ 邊界偵測：如果下方空間不夠，翻轉到游標上方
  if (y + tooltipHeight > window.innerHeight) {
    y = event.clientY - tooltipHeight - offset;
  }

  // 🛡️ 邊界偵測：如果右方空間不夠，翻轉到游標左方
  if (x + tooltipWidth > window.innerWidth) {
    x = event.clientX - tooltipWidth - offset;
  }

  // 更新座標
  mouseX.value = x;
  mouseY.value = y;
}

// 處理地圖點擊
function handleMapClick(event) {
  // 計算點擊位置在地圖上的相對百分比
  const rect = event.currentTarget.getBoundingClientRect();
  const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
  const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

  // 1. 在點擊的精準位置顯示地標圖示
  clickPos.value = { x: xPercent, y: yPercent };

  // 2. 判斷點擊的位置是否落在任何一個已定義的區域內
  const clickedLoc = props.locations.find(loc => 
    xPercent >= loc.x1 && xPercent <= loc.x2 && 
    yPercent >= loc.y1 && yPercent <= loc.y2
  );

  // 如果有踩到區域，回傳地點資料；如果點在區域外，回傳 null
  emit('pin-click', clickedLoc || null);
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
  cursor: crosshair; /* 提示可以點擊 */
}
.school-map { width: 100%; height: auto; display: block; }

/* 互動框 (Hitbox) 的樣式 */
.hitbox {
  position: absolute;
  background-color: transparent;
  cursor: pointer;
  z-index: 10;
}

/* 點擊選中後的樣式 (保留微亮回饋，如果這個也不想要可以直接刪除) */
.hitbox.is-selected {
  background-color: rgba(99, 134, 250, 0.3);
  border: 2px solid var(--primary-color);
  box-sizing: border-box;
}

/* 動態地標圖示 */
.pin-icon {
  position: absolute;
  width: 48px; 
  height: auto;
  transform: translate(-50%, -100%); 
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); 
  z-index: 20;
  pointer-events: none; 
}

/* 懸停小視窗 (Tooltip) 樣式 */
.hover-tooltip {
  position: fixed;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 100;
  pointer-events: none; 
  width: 160px;
}
.tooltip-title { margin: 0 0 8px 0; font-size: 1rem; color: var(--primary-color); text-align: center; }
.tooltip-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #eee; 
}

/* 圖標彈出的動畫 */
.bounce-enter-active { animation: bounce-in 0.4s; }
.bounce-leave-active { transition: opacity 0.2s; opacity: 0; }
@keyframes bounce-in {
  0% { transform: translate(-50%, -100%) scale(0) translateY(10px); opacity: 0; }
  60% { transform: translate(-50%, -100%) scale(1.1) translateY(-2px); opacity: 1; }
  100% { transform: translate(-50%, -100%) scale(1) translateY(0); opacity: 1; }
}
</style>