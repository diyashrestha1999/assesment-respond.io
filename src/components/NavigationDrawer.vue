<template>
  <v-navigation-drawer
    :model-value="drawerStore.isDrawerOpen"
    location="right"
    width="450"
    permanent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card flat max-height="100vh">
      {{ nodeDetail }}
      <v-card-title class="text-capitalize d-flex align-center">
        <v-icon
          v-if="nodeMapper[nodeDetail.id].icon"
          class="mr-2"
          :color="nodeMapper[nodeDetail.id].color"
        >
          {{ nodeMapper[nodeDetail.id].icon }}
        </v-icon>

        {{ nodeDetail.name || nodeDetail.type || nodeDetail.data.label }}
      </v-card-title>

      <v-card-text>
        <v-text-field
          :model-value="nodeDetail.data.label"
          rounded="lg"
          class="mb-1"
          density="compact"
          variant="outlined"
          label="Title"
          @change="
            updateNode({
              label: $event.target.value,
              comment: nodeDetail.data.comment,
            })
          "
        />

        <v-textarea
          :model-value="nodeDetail.data.comment"
          rounded="lg"
          class="mb-1"
          density="compact"
          variant="outlined"
          :label="
            nodeDetail.data.type === 'addComment' ? 'Comment' : 'Description'
          "
          @change="
            updateNode({
              label: nodeDetail.data.label,
              comment: $event.target.value,
            })
          "
        />

        <div
          v-if="
            nodeDetail.type === 'sendMessage' ||
            nodeDetail.data.type === 'sendMessage'
          "
          class="mb-2"
        >
          <div class="mb-1 font-weight-bold text-grey-darken-4">
            Title/Box Preview
          </div>

          <div
            class="dashed-border rounded-xl cursor-pointer"
            @click="openFiles"
          >
            <v-img
              v-if="nodeDetail.data.payload[1] || imgUrl"
              cover
              class="rounded-xl"
              :src="
                imgUrl ||
                nodeDetail.data.payload[0].attachment ||
                nodeDetail.data.payload[1].attachment
              "
            ></v-img>

            <div v-else class="h-100 d-flex align-center justify-center">
              <v-icon>mdi-plus</v-icon>
            </div>
          </div>

          <input
            ref="imgUploader"
            type="file"
            accept="image/*"
            class="d-none"
            @change="uploadImage($event)"
          />
        </div>

        <v-btn
          color="primary text-capitalize"
          rounded="lg"
          block
          @click="saveUpdatedNodeDetails"
        >
          Update
        </v-btn>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup>
import { useRoute } from "vue-router";

import { useDrawerStore } from "@/stores/drawer.js";
import { useNodeJsonStore } from "@/stores/nodeJson.js";

const route = useRoute();

const drawerStore = useDrawerStore();

const nodeStore = useNodeJsonStore();

const formValues = ref({});
const imgUploader = ref();
const imgUrl = ref(null);

const nodeDetail = computed(() => {
  return nodeStore.getNodeDetail(route.params.id) || {};
});

const nodesData = computed(() => nodeStore.nodesData);

const nodeMapper = computed(() => {
  return nodeStore.nodeMapper(nodesData.value);
});

function updateNode(obj) {
  formValues.value = { ...obj };
}

function saveUpdatedNodeDetails() {
  nodeStore.updateNode(route.params.id, formValues.value);
  console.log("formValues", nodeDetail.value);
}

function openFiles() {
  imgUploader.value.click();
}

function uploadImage(event) {
  const payload = [
    { text: "attachment" },
    { attachment: event.target.files[0] },
  ];
  formValues.value = {
    label: nodeDetail.value.data.comment,
    comment: nodeDetail.value.data.comment,
    payload,
  };
  imgUrl.value = URL.createObjectURL(event.target.files[0]);
}
</script>

<style scoped>
.dashed-border {
  height: 300px;
  border: grey dashed 3px;
}
</style>
