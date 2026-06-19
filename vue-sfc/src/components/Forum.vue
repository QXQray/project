<template>
  <div class="modal-overlay">
    <div class="modal-card forum-card">
      <div class="forum-header">
        <h2>💬 協尋廣播站</h2>
        <button class="btn btn-outline" @click="$emit('close')">關閉</button>
      </div>
      
      <div v-if="user" class="new-post-box">
        <input v-model="newTitle" class="form-control mb-2" placeholder="輸入發文標題..." />
        <textarea v-model="newContent" class="form-control mb-2" rows="2" placeholder="想說些什麼..."></textarea>
        <div class="text-right">
          <button class="btn btn-primary" @click="createPost">發布貼文</button>
        </div>
      </div>
      <div v-else class="login-prompt">
        請先登入才能發布貼文喔！
      </div>
      
      <div class="posts-list">
        <div v-if="posts.length === 0" class="empty-state">目前沒有貼文。</div>
        <div v-for="post in posts" :key="post.post_id" class="post-item">
          <div class="post-content">
            <h4 class="post-title">{{ post.title }}</h4>
            <p class="post-text">{{ post.content }}</p>
            <div class="post-meta">
              <span>發文者：{{ post.username }}</span> • 
              <span>{{ new Date(post.created_at).toLocaleString() }}</span>
            </div>
          </div>
          <button v-if="user?.role === 'Admin'" class="btn btn-danger btn-sm" @click="deletePost(post.post_id)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['user']);
const emit = defineEmits(['close']);

const posts = ref([]);
const newTitle = ref('');
const newContent = ref('');

async function fetchPosts() {
  const res = await fetch('/api/posts');
  posts.value = await res.json();
}

async function createPost() {
  if (!newTitle.value || !newContent.value) return;
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: props.user.user_id || 1, // 修改這裡以取得真實登入者的 ID
      title: newTitle.value,
      content: newContent.value
    })
  });
  if (res.ok) {
    newTitle.value = '';
    newContent.value = '';
    fetchPosts();
  }
}

async function deletePost(id) {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (res.ok) fetchPosts();
}

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.forum-card {
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
.forum-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forum-header h2 { margin: 0; }
.new-post-box { padding: 20px; background: #f8fafc; border-bottom: 1px solid var(--border-color); }
.mb-2 { margin-bottom: 8px; }
.text-right { text-align: right; }
.login-prompt { padding: 20px; text-align: center; color: var(--text-muted); background: #f8fafc; border-bottom: 1px solid var(--border-color);}

.posts-list {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.post-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.post-title { margin: 0 0 8px 0; color: var(--primary-color); }
.post-text { margin: 0 0 12px 0; color: var(--text-main); }
.post-meta { font-size: 0.8rem; color: var(--text-muted); }
.btn-sm { padding: 4px 8px; font-size: 0.8rem; }
.empty-state { text-align: center; color: var(--text-muted); }
</style>