// Given that you only need unweighted paths, a BFS approach is sufficient
function bfs(start, targets) {
  const visited = new Set();
  const queue = [{ ...start, path: [start] }];
  const allPaths = [];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    const { x, y, path } = currentNode;

    if (visited.has(`${x},${y}`)) continue;

    visited.add(`${x},${y}`);

    // Check if we're on a target node
    const targetNode = targets.find(
      (target) => target.x === x && target.y === y
    );
    if (targetNode) {
      allPaths.push(path.concat(targetNode));
      targets = targets.filter((target) => target.x !== x || target.y !== y);
      if (targets.length === 0) break; // All targets visited
    }

    // Push neighbors to queue
    const neighbors = [
      { x: x + 1, y }, // Right
      { x: x - 1, y }, // Left
      { x, y: y + 1 }, // Down
      { x, y: y - 1 }, // Up
      { x: x + 1, y: y + 1 }, // Bottom right diagonal
      { x: x - 1, y: y - 1 }, // Top left diagonal
      { x: x + 1, y: y - 1 }, // Top right diagonal
      { x: x - 1, y: y + 1 }, // Bottom left diagonal
    ].filter(
      (neigh) => neigh.x >= 0 && neigh.x < 50 && neigh.y >= 0 && neigh.y < 50
    );
    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
        queue.push({ ...neighbor, path: path.concat(neighbor) });
      }
    }
  }

  // Merge the paths (for now, just join them, there are more efficient ways to do this)
  const fullPath = allPaths.reduce((acc, currPath) => acc.concat(currPath), []);
  return fullPath;
}

export function dijkstra(start, targets) {
  return bfs(start, targets);
}
