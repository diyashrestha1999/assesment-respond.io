<template>
  <CanvasPage />
</template>

<script setup>
import CanvasPage from "@/components/CanvasPage.vue";
import { useDrawerStore } from "@/stores/drawer.js";

const drawerStore = useDrawerStore();

onBeforeMount(() => {
  setDrawer();
});

function setDrawer() {
  drawerStore.isDrawerOpen = false;
}
</script>
