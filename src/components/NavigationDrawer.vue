<template>
  <v-navigation-drawer
    :model-value="drawerStore.isDrawerOpen"
    location="right"
    width="450"
    permanent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card flat max-height="100vh" class="overflow-y-auto">
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
              v-if="
                (nodeDetail.data.payload && nodeDetail.data.payload[1]) ||
                imgUrl
              "
              cover
              class="rounded-xl h-100"
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

        <div
          v-if="
            nodeDetail.type === 'dateTime' ||
            nodeDetail.data.type === 'businessHours'
          "
        >
          <v-row
            v-for="time in nodeDetail.data.times"
            :key="time.day"
            class="pl-1 mb-1"
          >
            <v-col cols="2" class="text-capitalize font-weight-bold">
              {{ time.day }}
            </v-col>

            <v-col cols="2" class="border rounded-lg">
              {{ time.startTime }}
            </v-col>

            <v-col cols="1">
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-icon v-bind="menuProps">mdi-clock-outline</v-icon>
                </template>

                <v-list max-height="300px">
                  <v-list-item
                    v-for="hour in hoursWithMinutes"
                    :key="hour"
                    @click="setTime(time.day, 'startTime', hour)"
                  >
                    {{ hour }}
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>

            <v-col cols="2" class="text-center"> to </v-col>

            <v-col cols="2" class="border rounded-lg">
              <div>{{ time.endTime }}</div>
            </v-col>

            <v-col cols="1">
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-icon v-bind="menuProps">mdi-clock-outline</v-icon>
                </template>

                <v-list max-height="300px">
                  <v-list-item
                    v-for="hour in hoursWithMinutes"
                    :key="hour"
                    @click="setTime(time.day, 'endTime', hour)"
                  >
                    {{ hour }}
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>

          <v-select
            v-model="timeZone"
            :items="timeZones"
            class="mt-3"
            variant="outlined"
            density="compact"
            @update:model-value="updateTimZone($event)"
          ></v-select>
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

const timeZones = ["UTC", "GMT", "WET", "Z"];

const nodeDetail = computed(() => {
  return nodeStore.getNodeDetail(route.params.id) || {};
});

const formValues = ref({});
const imgUploader = ref();
const imgUrl = ref(null);
const timeZone = ref(nodeDetail.value.data.timezone || timeZones[0]);

const hoursWithMinutes = computed(() => {
  return Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`,
  );
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

function setTime(day, interval, hour) {
  const updatedTime = nodeDetail.value.data.times.map((time) => {
    if (time.day === day) {
      time[interval] = hour;
      return time;
    }
    return time;
  });

  formValues.value = {
    label: nodeDetail.value.data.comment,
    comment: nodeDetail.value.data.comment,
    times: updatedTime,
  };
}
function updateTimZone($event) {
  formValues.value = {
    label: nodeDetail.value.data.comment,
    comment: nodeDetail.value.data.comment,
    timeZone: $event,
  };
}
</script>

<style scoped>
.dashed-border {
  height: 280px;
  border: grey dashed 3px;
}
</style>
