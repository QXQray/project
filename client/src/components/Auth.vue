<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <h2 class="modal-title">{{ isLogin ? '會員登入' : '註冊新帳號' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>學號 / 帳號：</label>
          <input v-model="username" class="form-control" placeholder="例如: D1358010" required/>
        </div>
        <div class="form-group">
          <label>密碼：</label>
          <input v-model="password" type="password" class="form-control" placeholder="請輸入密碼" required/>
        </div>
        <div v-if="!isLogin" class="form-group">
          <label>身份角色：</label>
          <select v-model="role" class="form-control">
            <option value="Student">一般學生</option>
            <!-- <option value="Admin">管理員</option> -->
          </select>
        </div>
        
        <div class="action-buttons">
          <button type="submit" class="btn btn-primary w-100">{{ isLogin ? '登入' : '註冊' }}</button>
          <button type="button" class="btn btn-outline w-100" @click="isLogin = !isLogin">
            {{ isLogin ? '沒有帳號？前往註冊' : '已有帳號？前往登入' }}
          </button>
          <button type="button" class="btn btn-text w-100" @click="$emit('cancel')">取消</button>
        </div>
      </form>
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
      emit('logged-in', { token: json.token, role: json.role, user_id: json.userId });
    } else {
      alert('註冊成功！請重新登入');
      isLogin.value = true;
    }
  } else {
    alert('發生錯誤，請檢查帳號密碼');
  }
}
</script>

<style scoped>
.modal-title { margin-top: 0; text-align: center; margin-bottom: 24px; color: var(--primary-color);}
.action-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
.w-100 { width: 100%; padding: 10px; }
.btn-text { background: none; border: none; color: var(--text-muted); cursor: pointer; }
.btn-text:hover { color: var(--text-main); text-decoration: underline; }
</style>