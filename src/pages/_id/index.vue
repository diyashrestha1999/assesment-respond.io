<template>
  <CanvasPage />
</template>

<script setup>
import CanvasPage from "@/components/CanvasPage.vue";
import { useDrawerStore } from "@/stores/drawer.js";

const drawerStore = useDrawerStore();

onMounted(() => {
  setDrawer();
});

function setDrawer() {
  drawerStore.isDrawerOpen = true;
}
</script>
