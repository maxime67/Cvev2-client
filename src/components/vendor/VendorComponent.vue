<template>
  <h1> This is Vendor Page for {{ $route.params.id }}</h1>
  <h1> {{ vendor }}</h1>
  <div v-for="product in productList">
    <h1>{{ product }}</h1>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {findVendorById} from "@/services/VendorService.js";
import {findAllProductByVendor, findProductByVendorId} from "@/services/ProductService.js";
import { useRoute } from "vue-router";
const vendor = ref(null);
const productList = ref([null]);
const route = useRoute();

const fetchVendor = async () => {
  try {
    vendor.value = await findVendorById(route.params.id);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchProducts = async () => {
  try {
    productList.value = await findProductByVendorId(vendor.value._id);
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