<template>
  <div
      @click="router.push({ path: `cve/${props.cve?._id}`})"
      class="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden max-w-xs flex cursor-pointer">
    <div class="w-1.5" :class="getSeverityClass(getSeverity(baseScore))"></div>
    <div class="flex-1 p-3">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          <span class="inline-block w-2 h-2 rounded-full mr-2" :class="getSeverityClass(getSeverity(baseScore))"></span>
          <h3 class="text-sm font-bold text-gray-800 truncate">{{ safeId }}</h3>
        </div>
        <div class="bg-gray-100 text-xs px-1.5 py-0.5 rounded">
          {{ formatDate(safePublishedDate) }}
        </div>
      </div>

      <div class="flex justify-between items-center text-xs">
        <div class="flex items-center">
          <span class="mr-1">{{ products.length || 0 }}</span>
          <span class="text-gray-500">produits</span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="text-gray-500">Score:</span>
          <div class="flex space-x-0.5">
            <div v-for="i in 5" :key="i" class="w-1.5 h-3 rounded-sm" :class="baseScore >= i*2 ? getSeverityClass(getSeverity(baseScore)) : 'bg-gray-200'"></div>
          </div>
          <span class="font-bold ml-1">{{ baseScore }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {findProductById} from "@/services/ProductService.js";
import router from "../../../router/index.js";

const props = defineProps({
  cve: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

// Computed properties to safely access nested data
const safeId = computed(() => props.cve?.id || 'ID indisponible');
const safeSummary = computed(() => props.cve?.summary || 'Aucune description disponible');
let products = computed(() => props.cve?.products.slice(0, 5) || []);
const safePublishedDate = computed(() => props.cve?.published || null);


const baseScore = computed(() => {
  return props.cve?.metrics?.cvssMetric?.[0]?.baseScore ?? 0;
});

const getSeverity = (baseScore) => {
  if (baseScore < 4) return "LOW";
  if (baseScore < 7) return "MEDIUM";
  if (baseScore < 9) return "HIGH";
  return "CRITICAL";
};

const getSeverityClass = (severity) => {
  const classes = {
    'LOW': 'bg-green-500 text-white',
    'MEDIUM': 'bg-yellow-500 text-white',
    'HIGH': 'bg-orange-500 text-white',
    'CRITICAL': 'bg-red-500 text-white'
  };
  return classes[severity] || 'bg-gray-500 text-white';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (e) {
    return 'N/A';
  }
};


onMounted(() => {
});
</script>