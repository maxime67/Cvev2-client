<template>
  <div v-if="vendor && productList.length > 0"
       class="bg-white rounded-md shadow border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden max-w-xs">
    <div class="bg-blue-600 p-2 flex items-center justify-between">
      <h3 class="text-sm font-bold text-white truncate">
        {{ vendor.name }}
      </h3>
    </div>
    <div v-for="product in productList">
      <div v-if="product">
        {{ product.name }}
      </div>
    </div>
    <!-- Date de publication -->
    <div class="text-xs text-gray-500 pt-1 border-t border-gray-100">
      {{ formatDate(vendor.createdAt) }}
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {findVendorById} from "@/services/VendorService.js";
import {findAllProductByVendor} from "@/services/ProductService.js";

const vendor = ref(null);
const productList = ref([null]);
const id = "67f25a7942e42dd49ca40486";

const fetchVendor = async () => {
  try {
    vendor.value = await findVendorById(id);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchProducts = async () => {
  try {
    productList.value = await findAllProductByVendor(vendor.value.name);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Utilisation correcte de onMounted
onMounted(async () => {
  await fetchVendor();
  await fetchProducts();
});
</script>