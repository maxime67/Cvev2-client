<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>

            <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <a href="#" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
              <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
              <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
              <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
            </div>
          </div>
        </div>

        <!-- Autocomplete search -->
        <div class="search-container relative mr-4">
          <div class="input-container relative">
            <input
                type="text"
                v-model="searchQuery"
                @input="onSearchInput"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter="selectProduct"
                placeholder="Rechercher un vendeur..."
                class="w-64 py-1 px-3 pr-8 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
            />
            <div v-if="isLoading" class="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>

          <div v-show="showResults && searchQuery.length >= 3" class="results-container absolute w-64 max-h-60 overflow-y-auto mt-1 bg-gray-700 text-white rounded-md shadow-lg z-50">
            <ul v-if="searchResults.length > 0" class="py-1">
              <li
                  v-for="(result, index) in searchResults"
                  :key="index"
                  :class="{ 'bg-gray-600': index === selectedIndex }"
                  @click="selectProductByClick(index)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-600 text-sm"
              >
                {{ result.name }} [{{ result.productsCount}} produits]
              </li>
            </ul>
            <div v-else class="px-3 py-2 text-gray-400 text-sm">
              Aucun résultat trouvé
            </div>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">View notifications</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <a href="#" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
        <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
        <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>

        <!-- Mobile search -->
        <div class="search-container relative mt-3">
          <input
              type="text"
              v-model="searchQuery"
              @input="onSearchInput"
              @keydown.down.prevent="onArrowDown"
              @keydown.up.prevent="onArrowUp"
              @keydown.enter="selectProduct"
              placeholder="Rechercher un vendeur..."
              class="w-full py-2 px-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-base"
          />

          <div v-show="showResults && searchQuery.length >= 3" class="results-container absolute w-full max-h-60 overflow-y-auto mt-1 bg-gray-700 text-white rounded-md shadow-lg z-50">
            <ul v-if="searchResults.length > 0" class="py-1">
              <li
                  v-for="(result, index) in searchResults"
                  :key="index"
                  :class="{ 'bg-gray-600': index === selectedIndex }"
                  @click="selectProductByClick(index)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-600 text-base"
              >
                {{ result.name }}
              </li>
            </ul>
            <div v-else class="px-3 py-2 text-gray-400 text-base">
              Aucun résultat trouvé
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { findAllVendorByName } from "@/services/VendorService.js";

const searchQuery = ref('');
const searchResults = ref([]);
const showResults = ref(false);
const isLoading = ref(false);
const selectedIndex = ref(-1);
let debounceTimeout = null;

const onSearchInput = () => {
  // Nettoyer le timeout précédent
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Masquer les résultats si moins de 3 caractères
  if (searchQuery.value.length < 3) {
    showResults.value = false;
    searchResults.value = [];
    return;
  }

  // Débounce pour éviter trop d'appels API
  debounceTimeout = setTimeout(() => {
    fetchVendors();
  }, 300);
};

const fetchVendors = async () => {
  if (searchQuery.value.length >= 3) {
    isLoading.value = true;
    showResults.value = true;

    try {
      // Appel à votre API en utilisant la fonction existante
      const data = await findAllVendorByName(searchQuery.value);
      searchResults.value = data || [];
      selectedIndex.value = -1;
    } catch (error) {
      console.error('Erreur:', error);
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  }
};

const onArrowDown = () => {
  if (searchResults.value.length > 0) {
    if (selectedIndex.value < searchResults.value.length - 1) {
      selectedIndex.value++;
    } else {
      selectedIndex.value = 0;
    }
  }
};

const onArrowUp = () => {
  if (searchResults.value.length > 0) {
    if (selectedIndex.value > 0) {
      selectedIndex.value--;
    } else {
      selectedIndex.value = searchResults.value.length - 1;
    }
  }
};

const selectProduct = () => {
  if (selectedIndex.value >= 0 && searchResults.value.length > 0) {
    searchQuery.value = searchResults.value[selectedIndex.value].name;
    showResults.value = false;
  }
};

const selectProductByClick = (index) => {
  selectedIndex.value = index;
  searchQuery.value = searchResults.value[index].name;
  showResults.value = false;
};

// Fermer la liste de résultats si on clique ailleurs
const closeResults = (event) => {
  if (!event.target.closest('.search-container')) {
    showResults.value = false;
  }
};

// Utiliser les lifecycle hooks pour ajouter/retirer les event listeners
watch(showResults, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      window.addEventListener('click', closeResults);
    }, 0);
  } else {
    window.removeEventListener('click', closeResults);
  }
});

// S'assurer que les écouteurs d'événements sont nettoyés lors de la suppression du composant
onUnmounted(() => {
  window.removeEventListener('click', closeResults);
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
});
</script>

<style scoped>
/* Animation de chargement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>