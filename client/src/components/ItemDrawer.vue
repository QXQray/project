<template>
  <div class="drawer">
    <div class="drawer-header">
      <h2>📍 {{ location?.name }}</h2>
      <button class="btn-close" @click="close">✕</button>
    </div>

    <div class="drawer-content">
      <div v-if="items.length === 0" class="empty-state">
        <p>太好了！這裡目前沒有遺失物。</p>
      </div>
      
      <div v-else class="item-list">
        <div v-for="item in items" :key="item.item_id" class="item-card">
          <div class="item-info">
            <div class="item-header">
              <h4 class="item-name">{{ item.item_name }}</h4>
              
              <span v-if="user?.role !== 'Admin'" :class="['status-badge', statusClass(item.status)]">{{ item.status }}</span>
              
              <select 
                v-else 
                :value="item.status" 
                @change="e => $emit('update-status', item.item_id, e.target.value)"
                :class="['status-badge', 'admin-select', statusClass(item.status)]"
              >
                <option value="保存中">保存中</option>
                <option value="已認領">已認領</option>
                <option value="已銷毀">已銷毀</option>
              </select>
            </div>
            
            <details class="item-details">
              <summary>查看詳細描述</summary>
              <p class="item-desc">{{ item.description }}</p>
              <p class="item-time">🕒 申報時間：{{ item.created_at }}</p>
            </details>

            <div v-if="user?.role === 'Admin'" class="admin-actions">
              <button class="btn btn-danger btn-sm" @click="$emit('delete-item', item.item_id)">刪除此紀錄</button>
            </div>
          </div>
          <img v-if="item.photo_path" :src="item.photo_path" class="item-img" alt="Item photo" />
        </div>
      </div>
    </div>

    <div class="drawer-footer" v-if="user">
      <button class="btn btn-primary w-100" @click="$emit('report-item')">＋ 申報新遺失物</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  location: Object,
  items: Array,
  user: Object // 接收目前登入者的資訊
});
const emit = defineEmits(['close', 'report-item', 'update-status', 'delete-item']);

function close() {
  emit('close');
}

function statusClass(status) {
  if (status === '已認領') return 'status-claimed';
  if (status === '已銷毀') return 'status-destroyed';
  return 'status-saving';
}
</script>

<style scoped>
.drawer { position: fixed; top: 0; right: 0; width: 100%; max-width: 380px; height: 100vh; background: var(--bg-color); box-shadow: -4px 0 15px rgba(0,0,0,0.1); z-index: 50; display: flex; flex-direction: column; }
.drawer-header { background: var(--card-bg); padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
.drawer-header h2 { margin: 0; font-size: 1.25rem; }
.btn-close { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-muted); }
.drawer-content { padding: 20px; flex-grow: 1; overflow-y: auto; }
.empty-state { text-align: center; color: var(--text-muted); margin-top: 40px; }
.item-list { display: flex; flex-direction: column; gap: 12px; }

.item-card { background: var(--card-bg); border-radius: var(--radius); padding: 12px; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; gap: 12px; border-left: 4px solid var(--primary-color); }
.item-info { flex-grow: 1; min-width: 0; }
.item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 8px; }
.item-name { margin: 0; font-size: 1.05rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-details summary { cursor: pointer; font-size: 0.85rem; color: var(--primary-color); user-select: none; }
.item-details summary:hover { text-decoration: underline; }
.item-desc { margin: 8px 0 0 0; font-size: 0.9rem; color: var(--text-muted); background: #f8fafc; padding: 8px; border-radius: 6px; line-height: 1.4; }
.item-img { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }

.status-badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: bold; white-space: nowrap; }
.status-saving { background: #dbeafe; color: #1e3a8a; }
.status-claimed { background: #d1fae5; color: #065f46; border-left-color:#10b981; }
.status-destroyed { background: #f3f4f6; color: #4b5563; border-left-color:#6b7280; }

/* 管理員特製下拉選單樣式 */
.admin-select { border: 1px solid currentColor; cursor: pointer; outline: none; }
.admin-actions { margin-top: 12px; text-align: right; }
.btn-sm { padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; }

.drawer-footer { padding: 20px; background: var(--card-bg); border-top: 1px solid var(--border-color); }
.w-100 { width: 100%; padding: 12px; font-size: 1rem; }
.item-time { margin: 8px 0 0 0; font-size: 0.85rem; color: var(--text-muted); }
</style>