<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <!-- Mobile menu button -->
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button type="button" @click="toggleMobileMenu"
                  class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                  aria-controls="mobile-menu" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg :class="{'hidden': mobileMenuOpen, 'block': !mobileMenuOpen}" class="size-6" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
            <svg :class="{'block': mobileMenuOpen, 'hidden': !mobileMenuOpen}" class="size-6" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Logo -->
        <div @click="router.push('/')" class="cursor-pointer flex items-center">
          <img src="../../public/LOGO_ONE1.png" class="h-8 w-auto sm:h-10" alt="Logo">
        </div>

        <!-- Desktop navigation -->
        <div class="hidden sm:ml-6 sm:flex">
          <router-link v-if="isAuthenticated" to="/dashboard" class="rounded-md px-3 py-2 text-sm font-medium"
                       :class="[$route.path === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">
            Dashboard
          </router-link>
        </div>

        <!-- Search -->
        <div class="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
          <div class="search-container relative w-full max-w-lg">
            <div class="input-container relative flex">
              <select
                  v-model="searchType"
                  class="py-1 px-2 mr-1 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
              >
                <option value="vendor">Vendeur</option>
                <option value="product">Produit</option>
                <option value="cve">CVE</option>
              </select>

              <input
                  type="text"
                  v-model="searchQuery"
                  @input="onSearchInput"
                  @keydown.down.prevent="onArrowDown"
                  @keydown.up.prevent="onArrowUp"
                  @keydown.enter="selectSearchItem"
                  :placeholder="getPlaceholder()"
                  class="w-full py-1 px-3 pr-8 bg-gray-700 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
              />
              <div v-if="isLoading" class="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>

            <div v-show="showResults && searchQuery.length >= 3"
                 class="results-container absolute w-full max-h-60 overflow-y-auto mt-1 bg-gray-700 text-white rounded-md shadow-lg z-50">
              <ul v-if="searchResults.length > 0" class="py-1">
                <li
                    v-for="(result, index) in searchResults"
                    :key="index"
                    :class="{ 'bg-gray-600': index === selectedIndex }"
                    @click="selectSearchItemByClick(index)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-600 text-sm"
                >
                  <template v-if="searchType === 'vendor'">
                    {{ result.name }}
                  </template>
                  <template v-else-if="searchType === 'product'">
                    {{ result.name }}
                  </template>
                  <template v-else>
                    {{ result.id }}
                  </template>
                </li>
              </ul>
              <div v-else class="px-3 py-2 text-gray-400 text-sm">
                Aucun résultat trouvé
              </div>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="flex items-center ml-4">
          <!-- Notification icon -->
          <button type="button"
                  class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
            <span class="sr-only">View notifications</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                 aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
            </svg>
          </button>

          <!-- User profile/login -->
          <div class="ml-3 relative">
            <div v-if="isAuthenticated">
              <button @click="toggleProfileMenu" type="button"
                      class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {{ userInitials }}
                </div>
              </button>

              <div v-show="profileMenuOpen"
                   class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                   role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  Déconnexion
                </button>
              </div>
            </div>
            <div v-else class="flex items-center space-x-2">
              <router-link to="/login"
                           class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Connexion
              </router-link>
              <router-link to="/register"
                           class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                S'inscrire
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <router-link v-if="isAuthenticated" to="/dashboard" class="block rounded-md px-3 py-2 text-base font-medium"
                     :class="[$route.path === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">
          Dashboard
        </router-link>

        <!-- Mobile search -->
        <div class="search-container relative mt-3">
          <div class="flex mb-2">
            <select
                v-model="searchType"
                class="py-2 px-3 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-white text-base"
            >
              <option value="vendor">Vendeur</option>
              <option value="product">Produit</option>
              <option value="cve">CVE</option>
            </select>

            <input
                type="text"
                v-model="searchQuery"
                @input="onSearchInput"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter="selectSearchItem"
                :placeholder="getPlaceholder()"
                class="w-full py-2 px-3 bg-gray-700 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-white text-base"
            />
          </div>

          <div v-show="showResults && searchQuery.length >= 3"
               class="results-container absolute w-full max-h-60 overflow-y-auto mt-1 bg-gray-700 text-white rounded-md shadow-lg z-50">
            <ul v-if="searchResults.length > 0" class="py-1">
              <li
                  v-for="(result, index) in searchResults"
                  :key="index"
                  :class="{ 'bg-gray-600': index === selectedIndex }"
                  @click="selectSearchItemByClick(index)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-600 text-base"
              >
                <template v-if="searchType === 'vendor'">
                  {{ result.name }}
                </template>
                <template v-else-if="searchType === 'product'">
                  {{ result.name }}
                </template>
                <template v-else>
                  {{ result.id }}
                </template>
              </li>
            </ul>
            <div v-else class="px-3 py-2 text-gray-400 text-base">
              Aucun résultat trouvé
            </div>
          </div>
        </div>

        <!-- Authentication options for mobile -->
        <div v-if="!isAuthenticated" class="border-t border-gray-700 pt-2 mt-2">
          <router-link to="/login"
                       class="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Connexion
          </router-link>
          <router-link to="/register"
                       class="block text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
            S'inscrire
          </router-link>
        </div>
        <div v-else class="border-t border-gray-700 pt-2 mt-2">
          <div class="px-3 py-2 text-gray-300 font-medium">
            {{ currentUser?.username }}
          </div>
          <button @click="handleLogout"
                  class="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {ref, watch, onMounted, onUnmounted, computed} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {findAllVendorByName} from "@/services/VendorService.js";
import {findAllProductsByName} from "@/services/ProductService.js";
import {findCVEByIdentifier} from "@/services/CveService.js";
import {AuthService} from '@/services/AuthService';

const router = useRouter();
const route = useRoute();

// Search state
const searchQuery = ref('');
const searchResults = ref([]);
const showResults = ref(false);
const isLoading = ref(false);
const selectedIndex = ref(-1);
const searchType = ref('vendor'); // Default search type
let debounceTimeout = null;

// Menu state
const mobileMenuOpen = ref(false);
const profileMenuOpen = ref(false);

// Authentication state
const isAuthenticated = computed(() => AuthService.getters.isAuthenticated.value);
const currentUser = computed(() => AuthService.getters.currentUser.value);
const userInitials = computed(() => {
  if (!currentUser.value) return '';
  const username = currentUser.value.username || '';
  return username.charAt(0).toUpperCase();
});

// Toggle functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) profileMenuOpen.value = false;
};

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
};

// Logout handler
const handleLogout = () => {
  AuthService.logout();
  profileMenuOpen.value = false;
  router.push('/login');
};

// Get placeholder based on search type
const getPlaceholder = () => {
  switch(searchType.value) {
    case 'vendor':
      return 'Rechercher un vendeur...';
    case 'product':
      return 'Rechercher un produit...';
    case 'cve':
      return 'Rechercher une CVE (ex: CVE-2023-1234)...';
    default:
      return 'Rechercher...';
  }
};

// Handle search input with debounce
const onSearchInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);

  if (searchQuery.value.length < 3) {
    showResults.value = false;
    searchResults.value = [];
    return;
  }

  // Automatic switch to CVE search if query starts with CVE-
  if (searchQuery.value.toUpperCase().startsWith('CVE-')) {
    searchType.value = 'cve';
  }

  debounceTimeout = setTimeout(() => fetchSearchResults(), 300);
};

// Fetch search results based on the selected search type
const fetchSearchResults = async () => {
  if (searchQuery.value.length >= 3) {
    isLoading.value = true;
    showResults.value = true;

    try {
      switch(searchType.value) {
        case 'vendor':
          const vendorData = await findAllVendorByName(searchQuery.value);
          searchResults.value = vendorData || [];
          break;
        case 'product':
          const productData = await findAllProductsByName(searchQuery.value);
          searchResults.value = productData || [];
          break;
        case 'cve':
          const cveData = await findCVEByIdentifier(searchQuery.value);
          searchResults.value = cveData || [];
          break;
      }
      selectedIndex.value = -1;
    } catch (error) {
      console.error('Erreur:', error);
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  }
};

// Navigation with arrow keys
const onArrowDown = () => {
  if (searchResults.value.length > 0) {
    selectedIndex.value = (selectedIndex.value < searchResults.value.length - 1) ?
        selectedIndex.value + 1 : 0;
  }
};

const onArrowUp = () => {
  if (searchResults.value.length > 0) {
    selectedIndex.value = (selectedIndex.value > 0) ?
        selectedIndex.value - 1 : searchResults.value.length - 1;
  }
};

// Select search item based on current selection
const selectSearchItem = () => {
  if (selectedIndex.value >= 0 && searchResults.value.length > 0) {
    const selectedResult = searchResults.value[selectedIndex.value];

    // Update search query display
    searchQuery.value = searchType.value === 'cve' ? selectedResult.id : selectedResult.name;

    // Navigate based on search type
    navigateToResult(selectedResult);
    showResults.value = false;
  }
};

// Select search item by clicking
const selectSearchItemByClick = (index) => {
  selectedIndex.value = index;
  const selectedResult = searchResults.value[index];

  // Update search query display
  searchQuery.value = searchType.value === 'cve' ? selectedResult.id : selectedResult.name;

  // Navigate based on search type
  navigateToResult(selectedResult);
  showResults.value = false;
};

// Navigation logic based on selected result
const navigateToResult = (result) => {
  switch(searchType.value) {
    case 'vendor':
      router.push(`/vendor/${result._id}`);
      break;
    case 'product':
      router.push(`/product/${result._id}`);
      break;
    case 'cve':
      router.push(`/cve/${result._id}`);
      break;
  }
};

// Click outside handlers
const closeDropdowns = (event) => {
  // Close profile menu if click is outside profile menu
  if (!event.target.closest('#user-menu-button') && !event.target.closest('[role="menu"]')) {
    profileMenuOpen.value = false;
  }

  // Close search results if click is outside search container
  if (!event.target.closest('.search-container')) {
    showResults.value = false;
  }
};

// Reset search when changing routes
watch(() => route.path, () => {
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
});

// Reset results when changing search type
watch(searchType, () => {
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
});

// Initialize auth on component mount
onMounted(() => {
  AuthService.initialize();
  document.addEventListener('click', closeDropdowns);
});

// Clean up on component unmount
onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>