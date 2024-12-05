<script setup>
import '@vue-flow/core/dist/style.css'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { nodesData } from "@/constants/nodesData"
import {generateNodesAndEdgesWithPositions} from "@/utils/processData.js";
import {onMounted} from "vue";

const { onConnect, addEdges } = useVueFlow()

const dark = ref(false)
const nodes = ref([])
const edges = ref([])

function processJsonData() {
  const nodePositions = {
    1: { x: 250, y: 0 }, // trigger
    "b6a0c1": { x: 370, y: 300 }, // Away Message
    "d09c08":  { x: 217, y: 100 }, // Business Hours
    "161f52": { x: 100, y: 200 }, // Success
    "28c4b9": { x: 400, y: 200 }, // Failure
    "b0653a": { x: 62, y: 300 }, // Welcome Message
    "e879e4": { x: 361, y: 400 }, // Add Comment #1
  };

  nodesData.forEach((item) => {
    nodes.value.push({
      id: item.id.toString(),
      position: nodePositions[item.id],
      data: { label: item.name || item.type, ...item.data },
    });

    if (item.parentId && item.parentId !== -1) {
      edges.value.push({
        id: `e-${item.parentId}-${item.id}`,
        type: 'step',
        source: item.parentId.toString(),
        target: item.id.toString(),
      });
    }
  });
}

onMounted(() => {
  processJsonData()
})

function toggleDarkMode() {
  dark.value = !dark.value
}
</script>

<template>
  <div style="height: 100vh">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      :class="{dark}"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
    >
      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls position="top-left">
        <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
          <v-icon>{{dark ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny'}}</v-icon>
        </ControlButton>
      </Controls>
    </VueFlow>
  </div>
</template>
