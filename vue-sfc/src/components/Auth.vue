<template>
  <div class="auth-modal">
    <div class="modal-content">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
      <form @submit.prevent="submitForm">
        <div><label>Username:</label><input v-model="username" required/></div>
        <div><label>Password:</label><input v-model="password" type="password" required/></div>
        <div v-if="!isLogin">
          <label>Role:</label>
          <select v-model="role">
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
      </form>
      <button @click="isLogin = !isLogin">Toggle Mode</button>
      <button @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['logged-in', 'cancel']);

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const role = ref('Student');

async function submitForm() {
  const url = isLogin.value ? '/api/users/login' : '/api/users/register';
  const data = { username: username.value, password: password.value };
  if (!isLogin.value) {
    data.role = role.value;
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (res.ok) {
    const json = await res.json();
    if (isLogin.value) {
      emit('logged-in', { token: json.token, role: json.role, user_id: json.userId }); // simplified
    } else {
      alert('Registered, please login now');
      isLogin.value = true;
    }
  } else {
    alert('Error');
  }
}
</script>
<style scoped>
.auth-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;}
.modal-content { background: white; padding: 20px; }
</style>