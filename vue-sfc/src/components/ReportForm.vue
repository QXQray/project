<template>
  <div>
    <h2 class="modal-title">📦 申報新遺失物</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>物品名稱：</label>
        <input v-model="itemName" class="form-control" placeholder="例如：水壺、黑色皮夾" required />
      </div>
      
      <div class="form-group">
        <label>詳細描述與特徵：</label>
        <textarea v-model="description" class="form-control" rows="3" placeholder="描述其他細節，例如上面有柴犬貼紙..." required></textarea>
      </div>
      
      <div class="form-group">
        <label>上傳物品照片：</label>
        <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="$emit('cancel')">取消</button>
        <button type="submit" class="btn btn-primary">送出申報</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['locationId']);
const emit = defineEmits(['submit-success', 'cancel']);

// ✅ 新增 itemName 變數
const itemName = ref('');
const description = ref('');
const file = ref(null);

function onFileChange(e) {
  file.value = e.target.files[0];
}

async function submitForm() {
  const formData = new FormData();
  formData.append('location_id', props.locationId);
  formData.append('item_name', itemName.value); // ✅ 將 item_name 放進表單資料
  formData.append('description', description.value);
  if (file.value) {
    formData.append('photo', file.value);
  }

  const response = await fetch('/api/items', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    alert('申報成功！');
    emit('submit-success');
  } else {
    const errorText = await response.text();
    alert('發生錯誤: ' + errorText);
  }
}
</script>

<style scoped>
.modal-title { margin-top: 0; margin-bottom: 20px; color: var(--text-main);}
textarea.form-control { resize: vertical; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
</style>