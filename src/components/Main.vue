<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-blue-600 text-white px-4 py-2 font-bold">
      Informations importantes
    </div>
    <div class="relative bg-gray-50 overflow-hidden px-4 py-3">
      <div class="whitespace-nowrap scroll-animation inline-block">
              <span
                  v-for="cve in newsList"
                  :key="cve._id"
                  class="inline-block px-4 text-gray-800"
              >
                <little-cve-card :cve="cve"></little-cve-card>
              </span>
      </div>
    </div>
  </div>
  <div class="container mx-auto px-4 py-12">
    <!-- Nouvelle div horizontale pour les CVE les plus critiques -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div class="bg-yellow-600 px-6 py-4">
        <h2 class="text-2xl font-semibold text-white">CVE Critiques</h2>
      </div>
      <div class="p-6">
        <div v-if="criticalCveList.length === 0" class="text-center py-4 text-gray-500">
          Chargement des données...
        </div>
        <div v-else class="flex overflow-x-auto gap-4 pb-2">
          <div v-for="cve in criticalCveList" :key="cve.id" class="flex-shrink-0 w-72">
            <CveCard :cve="cve" class="h-full"></CveCard>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Colonne des Vendeurs -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-blue-600 px-6 py-4">
          <h2 class="text-2xl font-semibold text-white">Nouveaux Fournisseurs</h2>
        </div>
        <div class="p-6 space-y-6">
          <div v-if="lastCreatedVendorList.length === 0" class="text-center py-8 text-gray-500">
            Chargement des données...
          </div>
          <div v-else class="grid gap-4">
            <div v-for="vendor in lastCreatedVendorList" :key="vendor.id" class="transition-all duration-300 ">
              <VendorUnitCard :vendor="vendor" class="h-full"></VendorUnitCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne des CVE -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-red-600 px-6 py-4">
          <h2 class="text-2xl font-semibold text-white">Nouvelles CVE</h2>
        </div>
        <div class="p-6 space-y-6">
          <div v-if="lastCreatedCveList.length === 0" class="text-center py-8 text-gray-500">
            Chargement des données...
          </div>
          <div v-else class="grid gap-4">
            <div v-for="cve in lastCreatedCveList" :key="cve.id" class="transition-all duration-300 ">
              <CveCard :cve="cve" class="h-full"></CveCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.scroll-animation {
  animation: scroll 19s linear infinite;
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import { findAllLastCreated } from "@/services/VendorService.js";
import { findLastCreatedCve, findByBaseScoreLimit } from "@/services/CveService.js";
import VendorUnitCard from "@/components/VendorUnitCard.vue";
import CveCard from "@/components/CveCard.vue";
import LittleCveCard from "@/components/littleCveCard.vue";

const lastCreatedVendorList = ref([]);
const lastCreatedCveList = ref([]);
const criticalCveList = ref([]);
const newsList = ref([]);
const displayAll = async () => {
  try {
    lastCreatedVendorList.value = await findAllLastCreated();
    lastCreatedCveList.value = await findLastCreatedCve(5);
    newsList.value = await findLastCreatedCve(2);
    criticalCveList.value = await findByBaseScoreLimit(8);
    console.log(await lastCreatedCveList)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Utilisation correcte de onMounted avec composition API
onMounted(displayAll);
</script>