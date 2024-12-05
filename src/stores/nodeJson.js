import { defineStore } from "pinia";
import { nodeMapperConst } from "@/constants/nodesData.js";

const nodesData = [
  {
    id: 1,
    parentId: -1,
    type: "trigger",
    data: { type: "conversationOpened", oncePerContact: false },
  },
  {
    name: "Away Message",
    id: "b6a0c1",
    type: "sendMessage",
    data: {
      payload: [
        {
          type: "text",
          text: "Sorry, we are currently away. We will respond as soon as possible.",
        },
      ],
    },
    parentId: "28c4b9",
  },
  {
    name: "Business Hours",
    id: "d09c08",
    type: "dateTime",
    data: {
      times: [
        { startTime: "09:00", endTime: "17:00", day: "mon" },
        { startTime: "09:00", endTime: "17:00", day: "tue" },
        { startTime: "09:00", endTime: "17:00", day: "wed" },
        { startTime: "09:00", endTime: "17:00", day: "thu" },
        { startTime: "09:00", endTime: "17:00", day: "fri" },
        { startTime: "09:00", endTime: "17:00", day: "sat" },
        { startTime: "09:00", endTime: "17:00", day: "sun" },
      ],
      connectors: ["161f52", "28c4b9"],
      timezone: "UTC",
      action: "businessHours",
    },
    parentId: 1,
  },
  {
    name: "Success",
    id: "161f52",
    type: "dateTimeConnector",
    data: { connectorType: "success" },
    parentId: "d09c08",
  },
  {
    name: "Failure",
    id: "28c4b9",
    type: "dateTimeConnector",
    data: { connectorType: "failure" },
    parentId: "d09c08",
  },
  {
    name: "Welcome Message",
    id: "b0653a",
    type: "sendMessage",
    data: {
      payload: [
        { type: "text", text: "Hello there welcome to the chat!" },
        {
          type: "attachment",
          attachment:
            "https://fastly.picsum.photos/id/396/536/354.jpg?hmac=GmUosOuXb6nGkFhmTE-83i0ciQcaleMyvIyqzeFbW58",
        },
      ],
    },
    parentId: "161f52",
  },
  {
    id: "e879e4",
    type: "addComment",
    parentId: "b6a0c1",
    name: "Add Comment #1",
    data: { comment: "User message during off hours" },
  },
];
const nodeMapper = {
  // trigger
  1: {
    icon: "mdi-lightning-bolt-outline",
    color: "red",
    position: { x: 242.8, y: 0 },
  },

  // Business Hours
  d09c08: {
    icon: "mdi-calendar",
    color: "orange",
    position: { x: 242.2, y: 150 },
  },

  // Success
  "161f52": { icon: "", position: { x: 100, y: 300 } },

  // Failure
  "28c4b9": { icon: "", position: { x: 500, y: 300 } },

  // Welcome Message
  b0653a: {
    icon: "mdi-send",
    color: "green",
    position: { x: 36, y: 400 },
  },

  // Away Message
  b6a0c1: {
    icon: "mdi-send",
    color: "green",
    position: { x: 431.5, y: 400 },
  },

  // Add Comment #1
  e879e4: {
    icon: "mdi-message-reply-text",
    color: "blue",
    position: { x: 431.5, y: 600 },
  },
};

export const useNodeJsonStore = defineStore("nodeJson", {
  state: () => ({
    nodesData: nodesData,
  }),
  getters: {
    getNodeDetail: (state) => (id) =>
      state.nodesData.find((node) => node.id == id),

    nodeMapper: () => (nodesData) => {
      const filteredNodes = nodesData.filter((node) => {
        return !Object.keys(nodeMapperConst).includes(node.id.toString());
      });

      const updatedNodes = filteredNodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});

      return {
        ...nodeMapperConst,
        ...updatedNodes,
      };
    },
  },
  actions: {
    updateNode(id, payload) {
      const index = this.nodesData.findIndex((node) => node.id == id);
      if (index !== -1) {
        this.nodesData[index].data = {
          ...this.nodesData[index].data,
          ...payload,
        };
      }
    },
    addNode(node) {
      this.nodesData.push(node);
    },
  },
});
