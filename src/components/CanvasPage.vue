<template>
  <div style="height: 100vh">
    <VueFlow
      v-model:nodes="processJsonData.nodes"
      v-model:edges="processJsonData.edges"
      fit-view-on-init
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      :node-types="nodeTypes"
    >
      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls position="top-left">
        <v-btn
          class="ml-2 text-capitalize"
          color="secondary"
          @click="handleCreateNodeDialogOpen"
        >
          Create new node
        </v-btn>
      </Controls>
    </VueFlow>
  </div>

  <v-dialog v-model="nodeDialog.isOpen" width="500px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        Create new node

        <v-btn flat icon @click="resetCreateNodeDialog">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="nodeDialog.values.title"
          rounded="lg"
          class="mb-1"
          density="compact"
          variant="outlined"
          :error-messages="validator.title.$errors.map((e) => e.$message)"
          label="Title"
        />

        <v-textarea
          v-model="nodeDialog.values.description"
          rounded="lg"
          class="mb-1"
          density="compact"
          variant="outlined"
          :error-messages="validator.description.$errors.map((e) => e.$message)"
          label="Description"
        />

        <v-select
          v-model="nodeDialog.values.type"
          :items="nodeVariants"
          rounded="lg"
          class="mb-1"
          density="compact"
          variant="outlined"
          label="Type of Node"
          :error-messages="validator.type.$errors.map((e) => e.$message)"
        />

        <v-btn
          color="primary text-capitalize"
          rounded="lg"
          block
          @click="createNode"
        >
          Create
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import "@vue-flow/core/dist/style.css";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import useVuelidate from "@/composables/vuelidate.js";
import { helpers, required } from "@vuelidate/validators";

import CustomNode from "@/components/CustomNode.vue";
import { useNodeJsonStore } from "@/stores/nodeJson.js";
import { deepCopy } from "@/utils/misc.js";

const { addNodes, onNodeClick } = useVueFlow();

const router = useRouter();

const route = useRoute();

const nodeStore = useNodeJsonStore();

const nodeTypes = markRaw({
  default: CustomNode,
});

const nodeVariants = [
  { title: "Send Message", value: "sendMessage" },
  { title: "Add Comment", value: "addComment" },
  { title: "Business Hour", value: "businessHours" },
];

const defaultNodeDialog = {
  isOpen: false,
  values: {
    title: "",
    description: "",
    type: null,
  },
};

const nodeDialog = ref(deepCopy(defaultNodeDialog));

const validationRules = {
  title: {
    required: helpers.withMessage("Title cannot be empty", required),
  },
  description: {
    required: helpers.withMessage("Description cannot be empty", required),
  },
  type: {
    required: helpers.withMessage("Type cannot be empty", required),
  },
};

const validationFields = {
  title: computed(() => nodeDialog.value.values.title),
  description: computed(() => nodeDialog.value.values.description),
  type: computed(() => nodeDialog.value.values.type),
};

const validator = useVuelidate(validationRules, validationFields);

onNodeClick(({ node }) => {
  if (route.params.id === node.id) {
    router.push({ name: "default" });
  } else {
    router.push({ name: "detail", params: { id: node.id } });
  }
});

const nodesData = computed(() => nodeStore.nodesData);

const nodeMapper = computed(() => {
  return nodeStore.nodeMapper(nodesData.value);
});

const processJsonData = computed(() => {
  const nodes = [];
  const edges = [];

  nodeStore.nodesData.forEach((item) => {
    nodes.push({
      id: item.id.toString(),
      position: nodeMapper.value[item.id].position,
      data: {
        ...item.data,
        label: item.name || item.type,
        icon: nodeMapper.value[item.id].icon,
        color: nodeMapper.value[item.id].color,
      },
    });

    if (item.parentId && item.parentId !== -1) {
      edges.push({
        id: `e-${item.parentId}-${item.id}`,
        type: "step",
        source: item.parentId.toString(),
        target: item.id.toString(),
      });
    }
  });

  return { nodes, edges };
});

function handleCreateNodeDialogOpen() {
  validator.value.$reset();
  nodeDialog.value.isOpen = true;
}

function resetCreateNodeDialog() {
  nodeDialog.value = deepCopy(defaultNodeDialog);
}

async function createNode() {
  const isFormValid = await validator.value.$validate();

  if (!isFormValid) {
    return;
  }

  const id = processJsonData.value.nodes.length + 1;

  const newNode = {
    id: `random_node-${id}`,
    position: { x: 0, y: processJsonData.value.nodes.length * 30 },
    data: {
      label: nodeDialog.value.values.title,
      comment: nodeDialog.value.values.description,
      type: nodeDialog.value.values.type,
    },
  };

  if (nodeDialog.value.values.type === "businessHours") {
    newNode.data.times = [
      { startTime: "09:00", endTime: "17:00", day: "mon" },
      { startTime: "09:00", endTime: "17:00", day: "tue" },
      { startTime: "09:00", endTime: "17:00", day: "wed" },
      { startTime: "09:00", endTime: "17:00", day: "thu" },
      { startTime: "09:00", endTime: "17:00", day: "fri" },
      { startTime: "09:00", endTime: "17:00", day: "sat" },
      { startTime: "09:00", endTime: "17:00", day: "sun" },
    ];
  }

  addNodes([newNode]);
  nodeStore.addNode(newNode);
  resetCreateNodeDialog();
}
</script>
