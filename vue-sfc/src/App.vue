<template>
  <div id="app">
    <header>
      <h1>Campus Lost & Found</h1>
      <div>
        <button v-if="!user" @click="showAuth = true">Login</button>
        <span v-else>
          Welcome, {{ user.role }}
          <button @click="user = null">Logout</button>
        </span>
        <button @click="showForum = true">Forum</button>
      </div>
    </header>

    <CampusMap :locations="locations" @pin-click="handlePinClick" />

    <ItemDrawer 
      :isOpen="showDrawer" 
      :location="selectedLocation" 
      :items="locationItems" 
      @close="showDrawer = false"
      @report-item="showReport = true"
    />

    <Auth v-if="showAuth" @logged-in="handleLogin" @cancel="showAuth = false" />

    <div v-if="showReport" class="modal">
      <div class="modal-content">
        <ReportForm 
          :locationId="selectedLocation.location_id" 
          @submit-success="onReportSuccess"
          @cancel="showReport = false"
        />
      </div>
    </div>

    <Forum v-if="showForum" :user="user" @close="showForum = false" />
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

onMounted(async () => {
  const res = await fetch('/api/locations');
  locations.value = await res.json();
});

function handlePinClick(loc) {
  selectedLocation.value = loc;
  fetchItems(loc.location_id);
  showDrawer.value = true;
}

async function fetchItems(location_id) {
  const res = await fetch(`/api/items?location_id=${location_id}`);
  const data = await res.json();
  locationItems.value = data;
}

function handleLogin({ token, role }) {
  user.value = { token, role };
  showAuth.value = false;
}

function onReportSuccess() {
  showReport.value = false;
  fetchItems(selectedLocation.value.location_id);
}

// Optionally fetch locations mapping from backend if we had an endpoint
</script>

<style>
header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #eee; }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100;}
.modal-content { background: white; padding: 2rem; }
</style>
