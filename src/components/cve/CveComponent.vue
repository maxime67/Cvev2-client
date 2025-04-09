<template>
  <div v-if="!loading" class="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
    <!-- En-tête avec ID et sévérité -->
    <div class="p-3 flex items-center justify-between" :class="getSeverityHeaderClass(getSeverity(baseScore))">
      <h3 class="text-lg font-bold text-white truncate">{{ safeId }}</h3>
      <span v-if="hasCvssMetrics" class="px-2 py-1 text-xs font-medium rounded-full"
            :class="getSeverityClass(getSeverity(baseScore))">
        {{ getSeverity(baseScore) }} ({{ baseScore }})
      </span>
    </div>

    <!-- Corps de la carte -->
    <div class="p-4">
      <!-- Description complète -->
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">Description</h4>
        <p class="text-gray-700 text-sm">{{ safeSummary }}</p>
      </div>

      <!-- Détails CVSS -->
      <div v-if="hasCvssMetrics" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">CVSS Metrics (v{{ cvssVersion }})</h4>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div><span class="text-gray-500">Vector:</span> <span class="font-medium">{{ vectorString }}</span></div>
          <div><span class="text-gray-500">Access Vector:</span> <span class="font-medium">{{ accessVector }}</span></div>
          <div><span class="text-gray-500">Access Complexity:</span> <span class="font-medium">{{ accessComplexity }}</span></div>
          <div><span class="text-gray-500">Authentication:</span> <span class="font-medium">{{ authentication }}</span></div>
          <div><span class="text-gray-500">Confidentiality:</span> <span class="font-medium">{{ confidentialityImpact }}</span></div>
          <div><span class="text-gray-500">Integrity:</span> <span class="font-medium">{{ integrityImpact }}</span></div>
          <div><span class="text-gray-500">Availability:</span> <span class="font-medium">{{ availabilityImpact }}</span></div>
          <div><span class="text-gray-500">Exploitability:</span> <span class="font-medium">{{ exploitabilityScore }}</span></div>
          <div><span class="text-gray-500">Impact Score:</span> <span class="font-medium">{{ impactScore }}</span></div>
        </div>
      </div>

      <!-- Visualisation du score avec les barres -->
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">Score visuel</h4>
        <div class="flex items-center space-x-1">
          <div class="flex space-x-0.5">
            <div v-for="i in 5" :key="i" class="w-6 h-3 rounded-sm"
                 :class="baseScore >= i*2 ? getSeverityClass(getSeverity(baseScore)) : 'bg-gray-200'"></div>
          </div>
          <span class="font-bold ml-1">{{ baseScore }}/10</span>
        </div>
      </div>

      <!-- Produits affectés -->
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">Produits affectés ({{ products.length || 0 }})</h4>
        <div v-if="products.length">
          <div v-for="(product, index) in products" :key="index" class="text-sm">
            <span class="font-medium">{{ product.name || 'N/A' }}</span>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">Aucun produit listé</div>
      </div>

      <!-- Références -->
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">Références ({{ referencesCount }})</h4>
        <div v-if="referencesCount > 0" class="max-h-40 overflow-y-auto">
          <a v-for="(ref, index) in uniqueReferences" :key="index"
             :href="ref.url" target="_blank" rel="noopener noreferrer"
             class="block text-xs text-blue-600 hover:underline mb-1 truncate">
            {{ ref.url }}
          </a>
        </div>
        <div v-else class="text-sm text-gray-500">Aucune référence disponible</div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
        <div>
          <span class="block">Publié:</span>
          <span class="font-medium">{{ formatDate(safePublishedDate) }}</span>
        </div>
        <div>
          <span class="block">Dernière modification:</span>
          <span class="font-medium">{{ formatDate(safeLastModified) }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="bg-white rounded-md shadow border border-gray-200 p-6 flex justify-center items-center">
    <span class="text-gray-500">Chargement des données...</span>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { findProductById } from "@/services/ProductService.js";
import { findById } from "@/services/CveService.js";

// Get the route to access parameters
const route = useRoute();

// State
const cveData = ref(null);
const products = ref([]);
const loading = ref(true);

// Fetch CVE data based on route parameter
const fetchCveData = async () => {
  try {
    const data = await findById(route.params.id);
    cveData.value = data;

    // Fetch related products if available
    if (data && data.products && data.products.length > 0) {
      products.value = await getProductList(data.products);
    }
  } catch (error) {
    console.error("Error fetching CVE data:", error);
  } finally {
    loading.value = false;
  }
};

// Computed properties to safely access nested data
const safeId = computed(() => cveData.value?.id || 'ID indisponible');
const safeSummary = computed(() => cveData.value?.summary || 'Aucune description disponible');
const safePublishedDate = computed(() => cveData.value?.published || null);
const safeLastModified = computed(() => cveData.value?.lastModified || null);

// CVSS Metrics
const hasCvssMetrics = computed(() => {
  return (cveData.value?.metrics?.cvssMetric?.length > 0 ||
      cveData.value?.metrics?.cvssMetric?.length > 0 ||
      cveData.value?.metrics?.cvssMetric?.length > 0);
});

// Get the active CVSS metric (prioritize V31, then V3, then V2)
const activeCvssMetric = computed(() => {
  if (cveData.value?.metrics?.cvssMetric?.length > 0) {
    return cveData.value.metrics.cvssMetric[0];
  } else if (cveData.value?.metrics?.cvssMetric?.length > 0) {
    return cveData.value.metrics.cvssMetric[0];
  } else if (cveData.value?.metrics?.cvssMetric?.length > 0) {
    return cveData.value.metrics.cvssMetric[0];
  }
  return null;
});

// CVSS Fields
const baseScore = computed(() => activeCvssMetric.value?.baseScore ?? 0);
const cvssVersion = computed(() => activeCvssMetric.value?.version ?? '');
const vectorString = computed(() => activeCvssMetric.value?.vectorString ?? '');
const accessVector = computed(() => activeCvssMetric.value?.accessVector ?? '');
const accessComplexity = computed(() => activeCvssMetric.value?.accessComplexity ?? '');
const authentication = computed(() => activeCvssMetric.value?.authentication ?? '');
const confidentialityImpact = computed(() => activeCvssMetric.value?.confidentialityImpact ?? '');
const integrityImpact = computed(() => activeCvssMetric.value?.integrityImpact ?? '');
const availabilityImpact = computed(() => activeCvssMetric.value?.availabilityImpact ?? '');
const exploitabilityScore = computed(() => activeCvssMetric.value?.exploitabilityScore ?? '');
const impactScore = computed(() => activeCvssMetric.value?.impactScore ?? '');

// References
const references = computed(() => cveData.value?.references || []);
const referencesCount = computed(() => references.value.length);

// Filter out duplicate references by URL
const uniqueReferences = computed(() => {
  const uniqueUrls = new Set();
  return references.value.filter(ref => {
    if (!uniqueUrls.has(ref.url)) {
      uniqueUrls.add(ref.url);
      return true;
    }
    return false;
  });
});

// Utility functions
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

const getSeverityHeaderClass = (severity) => {
  const classes = {
    'LOW': 'bg-green-600',
    'MEDIUM': 'bg-yellow-600',
    'HIGH': 'bg-orange-600',
    'CRITICAL': 'bg-red-600'
  };
  return classes[severity] || 'bg-blue-600';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return 'N/A';
  }
};

const getProductList = async (productIdList) => {
  const productArray = [];
  if (productIdList && productIdList.length > 0) {
    for (const productId of productIdList) {
      try {
        const product = await findProductById(productId);
        if (product) {
          productArray.push(product);
        }
      } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
      }
    }
  }
  return productArray;
};

// Fetch data when component is mounted
onMounted(() => {
  fetchCveData();
});
</script>