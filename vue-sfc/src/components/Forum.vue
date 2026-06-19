<template>
  <div class="forum-modal">
    <div class="modal-content">
      <h2>Forum</h2>
      <button @click="$emit('close')">Close</button>
      
      <div v-if="user" class="new-post">
        <h3>New Post</h3>
        <input v-model="newTitle" placeholder="Title" />
        <textarea v-model="newContent" placeholder="Content"></textarea>
        <button @click="createPost">Post</button>
      </div>
      
      <div class="posts">
        <div v-for="post in posts" :key="post.post_id" class="post">
          <h4>{{ post.title }}</h4>
          <p>{{ post.content }}</p>
          <small>By {{ post.username }} at {{ post.created_at }}</small>
          <button v-if="user?.role === 'Admin'" @click="deletePost(post.post_id)">Delete</button>
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
      user_id: 1, // hardcoded user_id for simplicity unless tracking
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
.forum-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;}
.modal-content { background: white; padding: 20px; width: 600px; max-height: 80vh; overflow-y: auto;}
.post { border: 1px solid #ccc; margin: 10px 0; padding: 10px; }
</style>