<template>
  <div id="app">
    <header class="app-header">
      <div class="header-container">
        <h1>🔍 FCU遺失物地圖</h1>
        <div class="header-actions">
          <button v-if="!user" class="btn btn-primary" @click="showAuth = true">登入 / 註冊</button>
          <div v-else class="user-info">
            <span class="badge">{{ user.role === 'Admin' ? '管理員' : '學生' }}</span>
            <button class="btn btn-outline" @click="user = null">登出</button>
          </div>
          <button class="btn btn-secondary" @click="showForum = true">💬 協尋討論區</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="marquee-wrapper" v-if="latestItems.length > 0">
        <span class="marquee-title">📢 最新協尋：</span>
        
        <div class="marquee-container">
          <div class="marquee-track">
            <div v-for="item in latestItems" :key="'orig-' + item.item_id" class="marquee-item" @click="handleMarqueeClick(item)">
              <span class="marquee-tag">🆕 最新</span>
              <span class="marquee-text">【{{ item.location_name }}】{{ item.item_name }}</span>
              <span class="marquee-time">{{ item.created_at.substring(0, 16) }}</span>
            </div>
            
            <div v-for="item in latestItems" :key="'clone-' + item.item_id" class="marquee-item" @click="handleMarqueeClick(item)">
              <span class="marquee-tag">🆕 最新</span>
              <span class="marquee-text">【{{ item.location_name }}】{{ item.item_name }}</span>
              <span class="marquee-time">{{ item.created_at.substring(0, 16) }}</span>
            </div>
          </div>
        </div>
      </div>

      <CampusMap :locations="locations" :selectedLocation="selectedLocation" @pin-click="handlePinClick" />
    </main>

    <Transition name="slide">
      <ItemDrawer 
        v-if="showDrawer"
        :isOpen="showDrawer" 
        :location="selectedLocation" 
        :items="locationItems" 
        :user="user"  @close="showDrawer = false"
        @report-item="showReport = true"
        @update-status="handleUpdateStatus"  @delete-item="handleDeleteItem"      />
    </Transition>

    <Transition name="fade">
      <Auth v-if="showAuth" @logged-in="handleLogin" @cancel="showAuth = false" />
    </Transition>

    <Transition name="fade">
      <div v-if="showReport" class="modal-overlay">
        <div class="modal-card">
          <ReportForm 
            :locationId="selectedLocation.location_id" 
            @submit-success="onReportSuccess"
            @cancel="showReport = false"
          />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <Forum v-if="showForum" :user="user" @close="showForum = false" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CampusMap from './components/CampusMap.vue';
import ItemDrawer from './components/ItemDrawer.vue';
import Auth from './components/Auth.vue';
import ReportForm from './components/ReportForm.vue';
import Forum from './components/Forum.vue';

const showAuth = ref(false);
const showForum = ref(false);
const showDrawer = ref(false);
const showReport = ref(false);

const user = ref(null);
const locations = ref([]);
const selectedLocation = ref(null);
const locationItems = ref([]);

const latestItems = ref([]);
const marqueeRef = ref(null);

onMounted(async () => {
  const res = await fetch('/api/locations');
  locations.value = await res.json();
  fetchLatestItems();
});

async function fetchLatestItems() {
  try {
    const res = await fetch('/api/items');
    const data = await res.json();
    
    latestItems.value = data
      .filter(item => item.created_at) // ✅ 防呆：把沒有時間的壞資料直接過濾掉
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5);
  } catch (error) {
    console.error('跑馬燈讀取失敗:', error);
  }
}

function scrollMarquee(direction) {
  if (marqueeRef.value) {
    marqueeRef.value.scrollBy({ left: direction * 250, behavior: 'smooth' });
  }
}

function handleMarqueeClick(item) {
  const loc = locations.value.find(l => l.location_id === item.location_id);
  if (loc) handlePinClick(loc);
}

function handlePinClick(loc) {
  if (loc) {
    // 點擊到我們定義好的區域內：顯示資料抽屜
    selectedLocation.value = loc;
    fetchItems(loc.location_id);
    showDrawer.value = true;
  } else {
    // 點擊在區域外：地標會出現，但是清空並關閉右側抽屜
    selectedLocation.value = null;
    showDrawer.value = false;
  }
}

async function fetchItems(location_id) {
  const res = await fetch(`/api/items?location_id=${location_id}`);
  const data = await res.json();
  locationItems.value = data;
}

function handleLogin({ token, role, user_id }) {
  user.value = { token, role, user_id }; 
  showAuth.value = false;
}

function onReportSuccess() {
  showReport.value = false;
  fetchItems(selectedLocation.value.location_id);
  fetchLatestItems();
}

// ✅ 實作：管理員更新狀態
async function handleUpdateStatus(itemId, newStatus) {
  const res = await fetch(`/api/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (res.ok) fetchItems(selectedLocation.value.location_id);
}

// ✅ 實作：管理員刪除資料
async function handleDeleteItem(itemId) {
  if (!confirm('確定要刪除這筆遺失物資料嗎？')) return;
  const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
  if (res.ok) fetchItems(selectedLocation.value.location_id);
}
</script>

<style>
.marquee-wrapper {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  padding: 10px 16px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  overflow: hidden; /* 隱藏跑出框外的元素 */
}
.marquee-title {
  font-weight: bold;
  color: var(--primary-color);
  white-space: nowrap;
  margin-right: 12px;
  z-index: 2;
  background: var(--card-bg); /* 避免被底下滾動的字蓋到 */
}
.marquee-container {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}
.marquee-track {
  display: flex;
  gap: 16px;
  width: max-content;
  /* 動畫：15秒轉一圈，勻速(linear)，無限循環(infinite) */
  animation: marquee-scroll 15s linear infinite; 
}
.marquee-track:hover {
  animation-play-state: paused; /* 🏆 游標指到時自動暫停，方便點擊 */
}
.marquee-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  background: var(--bg-color); border-radius: 20px; white-space: nowrap;
  cursor: pointer; transition: 0.2s; border: 1px solid var(--border-color);
}
.marquee-item:hover { background: #e0e7ff; border-color: var(--primary-color); }
.marquee-tag { background: #ef4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
.marquee-text { font-weight: 600; color: var(--text-main); font-size: 0.95rem; }
.marquee-time { font-size: 0.8rem; color: var(--text-muted); }

/* 無縫滾動動畫核心 */
@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  /* 往左移動剛好一半的距離 (加上 gap 的一半)，視覺上完美接軌 */
  100% { transform: translateX(calc(-50% - 8px)); } 
}

:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --secondary-color: #f59e0b;
  --secondary-hover: #d97706;
  --bg-color: #f3f4f6;
  --card-bg: #ffffff;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --radius: 8px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.5;
}

.app-header { background-color: var(--card-bg); box-shadow: var(--shadow-sm); padding: 1rem 0; position: sticky; top: 0; z-index: 10; }
.header-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
.header-container h1 { margin: 0; font-size: 1.5rem; color: var(--primary-color); }
.header-actions { display: flex; gap: 12px; align-items: center; }
.user-info { display: flex; align-items: center; gap: 12px; }
.badge { background: #e0e7ff; color: var(--primary-color); padding: 4px 10px; border-radius: 999px; font-size: 0.85rem; font-weight: bold; }
.main-content { max-width: 1200px; margin: 2rem auto; padding: 0 20px; }

.btn { padding: 8px 16px; border-radius: var(--radius); border: none; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: var(--primary-color); color: white; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-secondary { background: var(--secondary-color); color: white; }
.btn-secondary:hover { background: var(--secondary-hover); }
.btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
.btn-outline:hover { background: var(--bg-color); }
.btn-danger { background: #ef4444; color: white; }
.btn-danger:hover { background: #dc2626; }

.modal-overlay { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-card { background: var(--card-bg); padding: 24px; border-radius: 12px; box-shadow: var(--shadow-lg); width: 90%; max-width: 400px; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.95rem; }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius); font-size: 1rem; box-sizing: border-box; }
.form-control:focus { outline: 2px solid var(--primary-color); border-color: transparent; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>