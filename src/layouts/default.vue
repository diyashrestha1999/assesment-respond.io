<template>
  <v-app>
    <NavigationDrawer v-if="drawerStore.isDrawerOpen" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import { useDrawerStore } from "@/stores/drawer.js";

const drawerStore = useDrawerStore();
</script>
