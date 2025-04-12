<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Vendor info -->
    <div v-else-if="vendor" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="bg-blue-600 px-6 py-4">
        <h1 class="text-2xl font-bold text-white">{{ vendor.name }}</h1>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p class="text-gray-700">{{ vendor.description || 'Aucune description disponible' }}</p>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Informations</h2>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-600">Site web:</div>
              <div>
                <a v-if="vendor.website" :href="vendor.website" target="_blank" rel="noopener noreferrer"
                   class="text-blue-600 hover:underline">{{ vendor.website }}</a>
                <span v-else class="text-gray-500">Non disponible</span>
              </div>
              <div class="text-gray-600">Produits:</div>
              <div>{{ productList.length }}</div>
              <div class="text-gray-600">Dernière mise à jour:</div>
              <div>{{ formatDate(vendor.lastUpdated) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products list -->
    <div v-if="!loading && vendor" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-blue-600 px-6 py-4">
        <h2 class="text-xl font-semibold text-white">Produits ({{ productList.length }})</h2>
      </div>

      <!-- Loading products -->
      <div v-if="loadingProducts" class="flex justify-center items-center py-8">
        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="productList.length === 0" class="p-6 text-center">
        <p class="text-gray-500">Aucun produit disponible pour ce fournisseur</p>
      </div>

      <!-- Products grid -->
      <div v-else class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(product, index) in productList" :key="index"
               @click="navigateToProduct(product._id)"
               class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-800 truncate">{{ product.name }}</h3>
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">v{{ product.version || '1.0' }}</span>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description || 'Aucune description disponible' }}</p>

              <div class="flex justify-between items-center text-sm">
                <div class="flex items-center">
                  <div class="bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="font-medium">{{ productCveCounts[product._id] || 0 }} CVE</span>
                  </div>
                </div>
                <div class="text-gray-500">
                  Mis à jour le {{ formatDate(product.lastUpdated) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
      <strong class="font-bold">Erreur!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {findVendorById} from "@/services/VendorService.js";
import {findProductByVendorId} from "@/services/ProductService.js";
import {findAllCveByProductId} from "@/services/CveService.js";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

// State
const vendor = ref(null);
const productList = ref([]);
const productCveCounts = ref({});
const loading = ref(true);
const loadingProducts = ref(false);
const error = ref(null);

// Navigation
const navigateToProduct = (productId) => {
  router.push(`/product/${productId}`);
};

// Fetch vendor data
const fetchVendor = async () => {
  try {
    loading.value = true;
    const data = await findVendorById(route.params.id);
    vendor.value = data;
  } catch (err) {
    console.error('Error fetching vendor:', err);
    error.value = "Erreur lors du chargement des informations du fournisseur";
  } finally {
    loading.value = false;
  }
};

// Fetch products for vendor
const fetchProducts = async () => {
  try {
    loadingProducts.value = true;
    const products = await findProductByVendorId(route.params.id);
    productList.value = products;

    // Fetch CVE counts for each product
    await fetchCveCounts();
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = "Erreur lors du chargement des produits";
  } finally {
    loadingProducts.value = false;
  }
};

// Fetch CVE counts for each product
const fetchCveCounts = async () => {
  for (const product of productList.value) {
    try {
      const cves = await findAllCveByProductId(product._id);
      productCveCounts.value[product._id] = cves ? cves.length : 0;
    } catch (err) {
      console.error(`Error fetching CVEs for product ${product._id}:`, err);
      productCveCounts.value[product._id] = 0;
    }
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return 'N/A';
  }
};

// Initialize data
onMounted(async () => {
  await fetchVendor();
  if (vendor.value) {
    await fetchProducts();
  }
});
</script>