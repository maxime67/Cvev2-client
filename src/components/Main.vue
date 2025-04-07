<template>
  <div class="container mx-auto px-4 py-12">
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

<script setup>
import { onMounted, ref } from "vue";
import { findAllLastCreated } from "@/services/VendorService.js";
import { findLastCreatedCve } from "@/services/CveService.js";
import VendorUnitCard from "@/components/VendorUnitCard.vue";
import CveCard from "@/components/CveCard.vue";

const lastCreatedVendorList = ref([]);
const lastCreatedCveList = ref([]);

const displayAll = async () => {
  try {
    lastCreatedVendorList.value = await findAllLastCreated();
    lastCreatedCveList.value = await findLastCreatedCve();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Utilisation correcte de onMounted avec composition API
onMounted(displayAll);
</script>