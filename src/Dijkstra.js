function isValidNode(x, y, maxRows, maxCols) {
  return x >= 0 && y >= 0 && x < maxRows && y < maxCols;
}

function calculateDistance(nodeA, nodeB) {
  const dx = Math.abs(nodeA.x - nodeB.x);
  const dy = Math.abs(nodeA.y - nodeB.y);
  return Math.max(dx, dy);
}

async function findPathBetweenTwoNodes(
  start,
  end,
  maxRows,
  maxCols,
  obstacles,
  onNodeChecked
) {
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
    onNodeChecked([{ x: current.x, y: current.y }]);

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

export async function dijkstraStepByStep(
  start,
  targets,
  maxRows,
  maxCols,
  obstacles,
  onNodeChecked,
  onPathFound
) {
  let currentNode = start;
  let remainingTargets = [...targets];
  let fullPath = [];

  while (remainingTargets.length > 0) {
    let nearestTarget = null;
    let shortestPath = null;
    let shortestDistance = Infinity;

    for (const target of remainingTargets) {
      const path = await findPathBetweenTwoNodes(
        currentNode,
        target,
        maxRows,
        maxCols,
        obstacles,
        onNodeChecked
      );

      if (path.length < shortestDistance) {
        shortestDistance = path.length;
        nearestTarget = target;
        shortestPath = path;
      }
    }

    if (shortestPath) {
      fullPath = fullPath.concat(shortestPath.slice(1)); // Avoid duplicating the current node
      currentNode = nearestTarget;
      remainingTargets = remainingTargets.filter((t) => t !== nearestTarget);

      // Notify that a path to a target has been found
      if (onPathFound) {
        await onPathFound(fullPath, nearestTarget);
      }
    } else {
      console.warn("Unable to find path to all targets");
      break;
    }
  }

  return fullPath;
}
