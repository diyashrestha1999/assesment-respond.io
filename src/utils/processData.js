export function generateNodesAndEdgesWithPositions(nodesData) {
  const nodes = [];
  const edges = [];

  // Define default positions for each node (you can adjust these as needed)
  const nodePositions = {
    1: { x: 100, y: 100 }, // trigger
    "b6a0c1": { x: 400, y: 100 }, // Away Message
    "d09c08": { x: 100, y: 300 }, // Business Hours
    "161f52": { x: 400, y: 300 }, // Success
    "28c4b9": { x: 400, y: 500 }, // Failure
    "b0653a": { x: 700, y: 300 }, // Welcome Message
    "e879e4": { x: 700, y: 500 }, // Add Comment #1
  };

  // Create nodes with positions
  nodesData.forEach((node) => {
    nodes.push({
      id: node.id,
      name: node.name || node.type,  // If name exists, use it; otherwise, use type
      type: node.type,
      position: nodePositions[node.id] || { x: 0, y: 0 }, // Default position if not defined
    });
  });

  // Create edges based on the relationship
  nodesData.forEach((node) => {
    if (node.parentId) {
      edges.push({
        from: node.parentId,
        to: node.id,
      });
    }
  });

  return { nodes, edges };
}

