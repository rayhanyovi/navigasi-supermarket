// Dijkstra.js

// Existing BFS function with small modifications to return path between two points.
function bfs(start, end) {
  const visited = new Set();
  const queue = [{ ...start, path: [start] }];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    const { x, y, path } = currentNode;

    if (visited.has(`${x},${y}`)) continue;

    visited.add(`${x},${y}`);

    if (x === end.x && y === end.y) return path; // End the search if we found the target

    const neighbors = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
    ].filter(
      (neigh) => neigh.x >= 0 && neigh.x < 50 && neigh.y >= 0 && neigh.y < 50
    );

    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
        queue.push({ ...neighbor, path: path.concat(neighbor) });
      }
    }
  }
  return []; // If no path found
}

// Utility function to compute permutations of an array
function permute(array) {
  if (array.length === 0) return [[]];
  const firstElement = array[0];
  const remainingElements = array.slice(1);
  const permsWithoutFirst = permute(remainingElements);
  return permsWithoutFirst.reduce((acc, perm) => {
    for (let i = 0; i <= perm.length; i++) {
      const permWithFirst = [
        ...perm.slice(0, i),
        firstElement,
        ...perm.slice(i),
      ];
      acc.push(permWithFirst);
    }
    return acc;
  }, []);
}

// Helper function to remove overlap between successive BFS paths
function removeOverlap(firstPath, secondPath) {
  const last = firstPath[firstPath.length - 1];
  for (let i = 0; i < secondPath.length; i++) {
    if (secondPath[i].x === last.x && secondPath[i].y === last.y) {
      return firstPath.concat(secondPath.slice(i + 1));
    }
  }
  return firstPath.concat(secondPath);
}

export function dijkstra(start, targets) {
  const allOrders = permute(targets);
  let shortestPath = [];
  let shortestLength = Infinity;

  for (let order of allOrders) {
    let pathLength = 0;
    let currentPath = [start];
    let current = start;

    for (let target of order) {
      const segment = bfs(current, target);
      pathLength += segment.length;
      currentPath = removeOverlap(currentPath, segment);
      current = target;
    }

    if (pathLength < shortestLength) {
      shortestLength = pathLength;
      shortestPath = currentPath;
    }
  }
  return shortestPath;
}
