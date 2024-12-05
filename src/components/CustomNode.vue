<template>
  <div
    class="text-black"
    :class="[route.params.id == props.id ? 'bg-secondary' : 'bg-white']"
    style="max-width: 200px"
  >
    <div class="d-flex align-center px-3 py-2">
      <v-icon
        v-if="props.data.icon"
        :color="props.data.color"
        size="15px"
        class="mr-2"
      >
        {{ props.data.icon }}
      </v-icon>

      <div class="text-caption text-capitalize">
        {{ props.data.label }}
      </div>
    </div>

    <v-divider v-if="!props.data.connectorType" class="border-opacity-25" />

    <div class="text-grey-darken-3">
      <div v-if="props.data.comment" class="px-3 py-2">
        {{ truncateString(props.data.comment, 70) }}
      </div>

      <div
        v-else-if="props.data.type === 'conversationOpened'"
        class="px-3 py-2"
      >
        Conversation Opened
      </div>

      <div v-else-if="props.data.action === 'businessHours'" class="px-3 py-2">
        Business Hours - UTC
      </div>

      <div v-else-if="props.data.payload" class="px-3 py-2">
        Message: <br />
        <span class="font-italic">
          {{ truncateString(props.data.payload[0].text, 70) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { truncateString } from "@/utils/misc.js";
import { useRoute } from "vue-router";

const props = defineProps({
  id: {
    type: String,
  },
  data: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
</script>
