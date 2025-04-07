<template>
  <div
      class="bg-white rounded-md shadow border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden max-w-xs">
    <div class="bg-blue-600 p-2 flex items-center justify-between">
      <h3 class="text-sm font-bold text-white truncate">{{ vendor.vendor.name }}</h3>
      <span class="px-2 py-0.5 text-xs rounded-full">
        {{ vendor.products.length }} produits
      </span>
    </div>
    <!-- Date de publication -->
    <div class="text-xs text-gray-500 pt-1 border-t border-gray-100">
      {{ formatDate(vendor.vendor.createdAt) }}
    </div>
  </div>
</template>

<script setup>
// Utilisation de defineProps pour la composition API
const props = defineProps({
  vendor: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>