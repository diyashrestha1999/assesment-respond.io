<template>
  <div class="text-black bg-white" style="max-width: 200px">
    <div class="d-flex align-center px-3 py-2">
      <v-icon v-if="data.icon" :color="data.color" size="15px" class="mr-2">
        {{ data.icon }}
      </v-icon>

      <div class="text-caption text-capitalize">
        {{ data.label }}
      </div>
    </div>

    <v-divider v-if="!data.connectorType" class="border-opacity-25" />

    <div class="text-grey-darken-3">
      <div v-if="data.comment" class="px-3 py-2">
        {{ truncateString(data.comment, 70) }}
      </div>

      <div v-else-if="data.type === 'conversationOpened'" class="px-3 py-2">
        Conversation Opened
      </div>

      <div v-else-if="data.action === 'businessHours'" class="px-3 py-2">
        Business Hours - UTC
      </div>

      <div v-else-if="data.payload" class="px-3 py-2">
        Message: <br />
        <span class="font-italic">
          {{ truncateString(data.payload[0].text, 70) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { truncateString } from "@/utils/misc.js";

defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>
