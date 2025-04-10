<template>
 <h1> This is Vendor Page for {{ $route.params.id }}</h1>
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