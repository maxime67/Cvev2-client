<template>
  <div
      @click="router.push({ path: `cve/${props.cve?._id}`})"
      class="bg-white rounded-md shadow border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden max-w-xs">
    <!-- En-tête avec ID et sévérité -->
    <div class="bg-blue-600 p-2 flex items-center justify-between" v-if="hasCvssMetrics">
      <h3 class="text-sm font-bold text-white truncate">{{ safeId }}</h3>
      <span class="px-2 py-0.5 text-xs rounded-full" :class="getSeverityClass(getSeverity(baseScore))">
        {{ getSeverity(baseScore) }}
      </span>
    </div>

    <!-- Corps de la carte -->
    <div class="p-3">

      <!-- Informations essentielles -->
      <div class="flex justify-between text-xs mb-2">
        <div>
          <span class="text-gray-500">Produit:</span>
          <div v-for="(product, index) in products" :key="index">
            <span class="font-medium">{{ product.name || 'N/A' }}</span>
          </div>
          <span v-if="!products.length" class="font-medium">N/A</span>
        </div>
        <div v-if="hasCvssMetrics">
          <span class="font-medium">{{ baseScore }}</span>
          <span :class="getSeverityClass(getSeverity(baseScore))" class="ml-1 inline-block w-2 h-2 rounded-full"></span>
        </div>
      </div>

      <!-- Date de publication -->
      <div class="text-xs text-gray-500 pt-1 border-t border-gray-100">
        {{ formatDate(safePublishedDate) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {findProductById} from "@/services/ProductService.js";
import router from "../../router/index.js";

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
let products = computed(() => props.cve?.products || []);
const safePublishedDate = computed(() => props.cve?.published || null);

const hasCvssMetrics = computed(() => {
  return (props.cve?.metrics?.cvssMetricV2?.length > 0);
});

const baseScore = computed(() => {
  return props.cve?.metrics?.cvssMetricV2?.[0]?.baseScore ?? 0;
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

const getProductList = async (productIdList) => {
  let array = [];
  if (productIdList.length > 0) {
    productIdList.forEach((productId) => {
      const product = findProductById(productId);
      array.push(product)
    })
  }
  return array;
}

onMounted(() => {
});
</script>