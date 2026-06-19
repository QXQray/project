<template>
  <div>
    <h2>Report Item</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>Description:</label>
        <input v-model="description" required />
      </div>
      <div>
        <label>Photo:</label>
        <input type="file" @change="onFileChange" />
      </div>
      <button type="submit">Submit</button>
      <button type="button" @click="$emit('cancel')">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['locationId']);
const emit = defineEmits(['submit-success', 'cancel']);

const description = ref('');
const file = ref(null);

function onFileChange(e) {
  file.value = e.target.files[0];
}

async function submitForm() {
  const formData = new FormData();
  formData.append('location_id', props.locationId);
  formData.append('description', description.value);
  if (file.value) {
    formData.append('photo', file.value);
  }

  const response = await fetch('/api/items', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    alert('Reported successfully');
    emit('submit-success');
  } else {
    const errorText = await response.text();
    alert('Error: ' + errorText);
  }
}
</script>
