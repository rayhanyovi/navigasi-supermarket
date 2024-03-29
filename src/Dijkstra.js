import PriorityQueue from "js-priority-queue";

function isValidNode(x, y, maxRows, maxCols) {
  return x >= 0 && y >= 0 && x < maxRows && y < maxCols;
}

function calculateDistance(nodeA, nodeB) {
  const dx = Math.abs(nodeA.x - nodeB.x);
  const dy = Math.abs(nodeA.y - nodeB.y);
  return Math.max(dx, dy);
}

function findPathBetweenTwoNodes(start, end, maxRows, maxCols, obstacles) {
  const isValid = (x, y) => isValidNode(x, y, maxRows, maxCols);

  const visited = new Set();
  const queue = [];

  queue.push({ x: start.x, y: start.y, path: [], distance: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();

    if (current.x === end.x && current.y === end.y) {
      return current.path;
    }

    if (visited.has(`${current.x},${current.y}`)) continue;

    visited.add(`${current.x},${current.y}`);

    const neighbors = [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
      { x: current.x + 1, y: current.y + 1 },
      { x: current.x + 1, y: current.y - 1 },
      { x: current.x - 1, y: current.y + 1 },
      { x: current.x - 1, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      const { x, y } = neighbor;
      if (isValid(x, y) && !visited.has(`${x},${y}`)) {
        const newPath = [...current.path, neighbor];
        if (!obstacles.some((o) => o.x === x && o.y === y)) {
          const distance =
            calculateDistance(current, neighbor) + current.distance;
          queue.push({
            x,
            y,
            path: newPath,
            distance,
          });
        }
      }
    }
  }

  console.warn("Path not found between given nodes!");
  return [];
}

export function dijkstra(start, targets, maxRows, maxCols, obstacles) {
  const allPermutations = permute(targets);

  let shortestPath = null;
  let shortestDistance = Infinity;

  for (const permutation of allPermutations) {
    let remainingTargets = [...permutation];
    let currentNode = start;
    const path = [];

    while (remainingTargets.length > 0) {
      let minDistance = Infinity;
      let nearestTarget = null;
      let nearestPath = [];

      for (const target of remainingTargets) {
        const newPath = findPathBetweenTwoNodes(
          currentNode,
          target,
          maxRows,
          maxCols,
          obstacles
        );
        const distance = newPath.length;

        if (distance < minDistance) {
          minDistance = distance;
          nearestTarget = target;
          nearestPath = newPath;
        }
      }

      path.push(...nearestPath);
      currentNode = nearestTarget;
      remainingTargets = remainingTargets.filter(
        (target) => target !== nearestTarget
      );
    }

    const totalDistance =
      calculateDistance(start, permutation[0]) + path.length - 1;

    if (totalDistance < shortestDistance) {
      shortestDistance = totalDistance;
      shortestPath = path;
    }
  }

  console.log(shortestPath);

  return shortestPath;
}

// Function to generate all permutations of an array
function permute(arr) {
  const permutations = [];
  const permuteHelper = (arr, currentIndex) => {
    if (currentIndex === arr.length - 1) {
      permutations.push([...arr]);
      return;
    }

    for (let i = currentIndex; i < arr.length; i++) {
      [arr[currentIndex], arr[i]] = [arr[i], arr[currentIndex]];
      permuteHelper(arr, currentIndex + 1);
      [arr[currentIndex], arr[i]] = [arr[i], arr[currentIndex]];
    }
  };

  permuteHelper(arr, 0);
  return permutations;
}
