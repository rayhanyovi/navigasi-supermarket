import React, { useState } from "react";
import { dijkstra } from "./Dijkstra.js";

const GRID_SIZE = 50;
const START_NODE = { x: 0, y: 0 };

const TARGET_NODES = [
  { x: 10, y: 11, label: "A" },
  { x: 42, y: 15, label: "B" },
  { x: 10, y: 40, label: "C" },
  { x: 40, y: 45, label: "D" },
];

function PathfindingGrid() {
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [path, setPath] = useState([]);

  const toggleTarget = (label) => {
    setSelectedTargets((prev) => {
      if (prev.includes(label)) return prev.filter((l) => l !== label);
      return [...prev, label];
    });
  };

  const handleFindPath = () => {
    const newPath = dijkstra(
      START_NODE,
      selectedTargets.map((label) =>
        TARGET_NODES.find((node) => node.label === label)
      ),
      GRID_SIZE,
      GRID_SIZE
    );
    setPath(newPath);
  };

  return (
    <div>
      {TARGET_NODES.map((target) => (
        <label key={target.label}>
          <input
            type="checkbox"
            checked={selectedTargets.includes(target.label)}
            onChange={() => toggleTarget(target.label)}
          />
          {target.label}
        </label>
      ))}
      <button onClick={handleFindPath}>Find Path</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isStart = x === START_NODE.x && y === START_NODE.y;
          const isTarget = TARGET_NODES.some(
            (target) => target.x === x && target.y === y
          );
          const isInPath = path.some((point) => point.x === x && point.y === y);

          let backgroundColor = "white";
          if (isStart) backgroundColor = "red";
          else if (isTarget) backgroundColor = "blue";
          else if (isInPath) backgroundColor = "yellow";

          return (
            <div
              key={index}
              className="grid-cell"
              style={{ backgroundColor }}></div>
          );
        })}
      </div>
    </div>
  );
}

export default PathfindingGrid;
