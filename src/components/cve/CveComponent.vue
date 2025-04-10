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
      <!-- Boutons d'action -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button @click="toggleStatus('Follow')"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="statusMap.Follow ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {{ statusMap.Follow ? 'Following' : 'Follow' }}
        </button>

        <button @click="toggleStatus('Mitigated')"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="statusMap.Mitigated ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
          </svg>
          {{ statusMap.Mitigated ? 'Mitigated' : 'Mark as Mitigated' }}
        </button>

        <button @click="toggleStatus('Patch')"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="statusMap.Patch ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ statusMap.Patch ? 'Patched' : 'Mark as Patched' }}
        </button>
      </div>

      <!-- Message de statut -->
      <div v-if="statusMessage" class="mb-4 p-2 rounded-md text-sm" :class="statusMessageClass">
        {{ statusMessage }}
      </div>

      <!-- Notes -->
      <div v-if="showNotesInput || currentNotes" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">Notes</h4>
        <textarea v-if="showNotesInput"
                  v-model="notes"
                  class="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                  placeholder="Ajoutez vos notes concernant cette CVE..."></textarea>
        <p v-else-if="currentNotes" class="text-gray-700 text-sm p-2 bg-gray-50 rounded-md">{{ currentNotes }}</p>

        <div class="mt-2 flex justify-end space-x-2">
          <button v-if="showNotesInput" @click="saveNotes" class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
            Enregistrer
          </button>
          <button v-if="showNotesInput" @click="cancelNotes" class="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">
            Annuler
          </button>
          <button v-if="!showNotesInput" @click="editNotes" class="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">
            {{ currentNotes ? 'Modifier' : 'Ajouter des notes' }}
          </button>
        </div>
      </div>

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
import { AuthService } from "@/services/AuthService.js";
import { makeApiGetRequest, makeApiPostRequest, makeApiDeleteRequest } from "@/services/ApiService.js";

// Get the route to access parameters
const route = useRoute();

// State
const cveData = ref(null);
const products = ref([]);
const loading = ref(true);
const statusMap = ref({
  Follow: false,
  Mitigated: false,
  Patch: false
});
const statusMessage = ref('');
const statusMessageClass = ref('');

// Notes handling
const showNotesInput = ref(false);
const notes = ref('');
const currentNotes = ref('');

// Fetch CVE data based on route parameter
const fetchCveData = async () => {
  try {
    const data = await findById(route.params.id);
    cveData.value = data;

    // Fetch related products if available
    if (data && data.products && data.products.length > 0) {
      products.value = data.products;
    }

    // Fetch user interaction status if authenticated
    if (AuthService.getters.isAuthenticated.value) {
      await fetchUserInteraction();
    }
  } catch (error) {
    console.error("Error fetching CVE data:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch user interaction with this CVE
const fetchUserInteraction = async () => {
  try {
    const cveId = route.params.id;
    const response = await makeApiGetRequest(`/api/interaction/${cveId}`);
    if (response && response.status) {
      if (["Follow", "Mitigated", "Patch"].includes(response.status)) {
        statusMap.value[response.status] = true;
      } else {
        console.error("Statut inconnu reçu de l'API:", response.status);
      }
      currentNotes.value = response.notes || '';
    }
  } catch (error) {
    console.error("Error fetching user interaction:", error);
  }
};

// Toggle status for a CVE
const toggleStatus = async (status) => {
  if (!AuthService.getters.isAuthenticated.value) {
    statusMessage.value = "Veuillez vous connecter pour interagir avec cette CVE";
    statusMessageClass.value = "bg-yellow-100 text-yellow-800";
    return;
  }

  try {
    const cveId = route.params.id;

    // Si on clique sur un statut déjà actif, on le désactive
    if (statusMap.value[status]) {
      await makeApiDeleteRequest(`/api/interaction/delete/${cveId}`);

      Object.keys(statusMap.value).forEach(key => {
        statusMap.value[key] = false;
      });
      currentNotes.value = '';
    } else {
      // Sinon, on active ce statut et désactive les autres
      const response = await makeApiPostRequest(`/api/interaction/save/${cveId}`, {
        status,
        notes: currentNotes.value
      });

      Object.keys(statusMap.value).forEach(key => {
        statusMap.value[key] = key === status;
      });

    }

    // Faire disparaître le message après 3 secondes
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  } catch (error) {
    console.error("Error updating status:", error);
    statusMessage.value = "Une erreur est survenue lors de la mise à jour du statut";
    statusMessageClass.value = "bg-red-100 text-red-800";
  }
};

// Notes handling functions
const editNotes = () => {
  notes.value = currentNotes.value;
  showNotesInput.value = true;
};

const saveNotes = async () => {
  try {
    const cveId = route.params.id;
    // Trouver le statut actif
    const activeStatus = Object.keys(statusMap.value).find(key => statusMap.value[key]) || 'Follow';

    // Si un statut est déjà actif, mettre à jour les notes
    if (Object.values(statusMap.value).some(val => val)) {
      await makeApiPostRequest(`/api/interactions/${cveId}`, {
        status: activeStatus,
        notes: notes.value
      });
    } else {
      // Sinon, créer une nouvelle interaction avec Follow par défaut
      await makeApiPostRequest(`/api/interactions/${cveId}`, {
        status: 'Follow',
        notes: notes.value
      });
      statusMap.value.Follow = true;
    }

    currentNotes.value = notes.value;
    showNotesInput.value = false;

    statusMessage.value = "Notes enregistrées avec succès";
    statusMessageClass.value = "bg-green-100 text-green-800";

    // Faire disparaître le message après 3 secondes
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  } catch (error) {
    console.error("Error saving notes:", error);
    statusMessage.value = "Une erreur est survenue lors de l'enregistrement des notes";
    statusMessageClass.value = "bg-red-100 text-red-800";
  }
};

const cancelNotes = () => {
  showNotesInput.value = false;
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