import React, { useState, useEffect } from "react";
import PriorityQueue from "js-priority-queue";
import "./index.css";
import { dijkstra } from "./Dijkstra.js";
import "./Grid.css";
import itemsData from "./items.json";

const GRID_SIZE_X = 150;
const GRID_SIZE_Y = 60;
const START_NODE = { x: 130, y: 58 };
const supermarketMap = `${process.env.PUBLIC_URL}/supermarket-map.png`;

const TARGET_NODES = itemsData.items;

function PathfindingGrid() {
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [path, setPath] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const wallsDataFile = process.env.PUBLIC_URL + "/wall.json";

  useEffect(() => {
    fetch(wallsDataFile)
      .then((response) => response.json())
      .then((data) => setObstacles(data.walls))
      .catch((error) => console.error("Error loading wall data: ", error));
  }, []);

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
      GRID_SIZE_X,
      GRID_SIZE_Y,
      obstacles
    );

    setPath(newPath);
  };

  const getNodeColor = (x, y) => {
    if (x === START_NODE.x && y === START_NODE.y) return "red ";
    if (path.some((point) => point.x === x && point.y === y)) return "cyan ";

    if (
      selectedTargets.some(
        (label) =>
          TARGET_NODES.find((node) => node.label === label).x === x &&
          TARGET_NODES.find((node) => node.label === label).y === y
      )
    )
      return "blue"; // Target node
    if (obstacles.some((o) => o.x === x && o.y === y)) return "transparent  ";
    return "transparent  ";
  };

  return (
    <div className="grid-container">
      <div className="map-container">
        <div
          className="supermarket-map"
          style={{
            backgroundImage: `url(${supermarketMap})`,
            gridTemplateColumns: `repeat(${GRID_SIZE_X}, 10px)`,
            gridTemplateRows: `repeat(${GRID_SIZE_Y}, 10px)`,
          }}
        >
          {Array.from({ length: GRID_SIZE_X * GRID_SIZE_Y }).map((_, index) => {
            const x = index % GRID_SIZE_X;
            const y = Math.floor(index / GRID_SIZE_X);

            return (
              <div
                key={index}
                className="grid-cell"
                style={{ backgroundColor: getNodeColor(x, y) }}
              ></div>
            );
          })}
        </div>
      </div>

      <div className="item-container">
        <div className="list-title-container">
          <h4 style={{ margin: "0" }}>DAFTAR BELANJA</h4>
          <button onClick={handleFindPath}>Buat Rute Belanja</button>
        </div>

        <ul className="checkbox-container">
          {TARGET_NODES.map((target) => (
            <li className="list-item">
              <label key={target.label}>
                <input
                  type="checkbox"
                  checked={selectedTargets.includes(target.label)}
                  onChange={() => toggleTarget(target.label)}
                />
                {target.label}
              </label>
            </li>
          ))}{" "}
        </ul>

        <button onClick={handleFindPath}>Buat Rute Belanja</button>
      </div>
    </div>
  );
}

export default PathfindingGrid;
