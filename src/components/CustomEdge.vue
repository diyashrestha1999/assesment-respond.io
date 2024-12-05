<script setup>
import { ref, computed, onMounted } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  id: String,
  source: String,
  target: String,
  type: String,
  data: Object,
})

const { removeEdges } = useVueFlow()

const path = ref([])

onMounted(() => {
  path.value = getBezierPath(props)
})
</script>

<template>
  <BaseEdge :path="path[0]" />

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      class="nodrag nopan"
    >
      <button class="edgebutton" aria-label="Remove edge" @click="removeEdges(id)">
        ✖
      </button>
    </div>
  </EdgeLabelRenderer>
</template>

<style>
.edgebutton {
  border-radius: 999px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 16px;
  color: #f05f75;
  padding: 4px;
}

.edgebutton:hover {
  box-shadow: 0 0 0 2px pink, 0 0 0 4px #f05f75;
}
</style>
