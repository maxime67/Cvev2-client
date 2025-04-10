<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

    <!-- Message si l'utilisateur n'est pas authentifié -->
    <div v-if="!isAuthenticated" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
               fill="currentColor">
            <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Attention</h3>
          <div class="text-sm text-yellow-700 mt-2">
            <p>Vous devez être connecté pour accéder à votre tableau de bord.</p>
            <p class="mt-1">
              <router-link to="/login" class="font-medium text-yellow-800 underline hover:text-yellow-900">
                Se connecter
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Dashboard content -->
    <div v-else>
      <!-- Stats summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 p-3 bg-blue-100 rounded-md">
              <svg class="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-medium text-gray-900">Suivies</h2>
              <p class="text-2xl font-bold text-blue-600">{{ followCves.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 p-3 bg-orange-100 rounded-md">
              <svg class="h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-medium text-gray-900">En cours de mitigation</h2>
              <p class="text-2xl font-bold text-orange-600">{{ mitigatedCves.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 p-3 bg-green-100 rounded-md">
              <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-medium text-gray-900">Corrigées</h2>
              <p class="text-2xl font-bold text-green-600">{{ patchedCves.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CVE Category Display -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Follow Column -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div class="bg-blue-600 px-4 py-3">
            <h2 class="text-lg font-bold text-white">CVEs Suivies</h2>
          </div>

          <div class="p-4 h-[600px] overflow-y-auto">
            <div v-if="followCves.length === 0" class="text-center py-8 text-gray-500">
              Aucune CVE suivie
            </div>
            <div v-else class="space-y-4">
              <div
                  v-for="item in followCves"
                  :key="item.interaction._id"
                  class="flex items-center  cursor-pointer"
                  @click="goToCveDetails(item.cve._id)">
                <CveCard :cve="item.cve" class="h-full w-full"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Mitigated Column -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div class="bg-orange-600 px-4 py-3">
            <h2 class="text-lg font-bold text-white">CVEs en Mitigation</h2>
          </div>

          <div class="p-4 h-[600px] overflow-y-auto">
            <div v-if="mitigatedCves.length === 0" class="text-center py-8 text-gray-500">
              Aucune CVE en cours de mitigation
            </div>
            <div v-else class="space-y-4">
              <div
                  v-for="item in mitigatedCves"
                  :key="item.interaction._id"
                  class="flex items-center   cursor-pointer"
                  @click="goToCveDetails(item.cve._id)">
                <CveCard :cve="item.cve" class="h-full w-full"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Patched Column -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div class="bg-green-600 px-4 py-3">
            <h2 class="text-lg font-bold text-white">CVEs Corrigées</h2>
          </div>

          <div class="p-4 h-[600px] overflow-y-auto">
            <div v-if="patchedCves.length === 0" class="text-center py-8 text-gray-500">
              Aucune CVE corrigée
            </div>
            <div v-else class="space-y-4">
              <div
                  v-for="item in patchedCves"
                  :key="item.interaction._id"
                  class="flex items-center cursor-pointer"
                  @click="goToCveDetails(item.cve._id)">
                <CveCard :cve="item.cve" class="h-full w-full"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {getAllUserInteractions} from '@/services/InteractionService.js';
import {AuthService} from '@/services/AuthService';
import {useRouter} from 'vue-router';
import CveCard from '@/components/cve/CveCard.vue';

const router = useRouter();
const interactions = ref([]);
const loading = ref(true);
const error = ref(null);

// Authentication status
const isAuthenticated = computed(() => AuthService.getters.isAuthenticated.value);

// Filter CVEs by status
const followCves = computed(() => {
  return interactions.value.filter(item => item.interaction.status === 'Follow');
});

const mitigatedCves = computed(() => {
  return interactions.value.filter(item => item.interaction.status === 'Mitigated');
});

const patchedCves = computed(() => {
  return interactions.value.filter(item => item.interaction.status === 'Patch');
});

// Navigate to CVE details
const goToCveDetails = (cveId) => {
  router.push(`/cve/${cveId}`);
};

// Fetch data
const fetchInteractions = async () => {
  if (!isAuthenticated.value) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    interactions.value = await getAllUserInteractions();
  } catch (err) {
    console.error('Error fetching interactions:', err);
    error.value = 'Erreur lors du chargement des données';
  } finally {
    loading.value = false;
  }
};

// When component is mounted
onMounted(() => {
  fetchInteractions();
});
</script>

<style scoped>
/* Any additional styling if needed */
</style>