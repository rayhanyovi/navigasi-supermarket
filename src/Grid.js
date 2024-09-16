import React, { useState, useEffect, useCallback, useRef } from "react";
import "./index.css";
import { dijkstraStepByStep } from "./Dijkstra.js";
import "./Grid.css";
import itemsData from "./items.json";

const GRID_SIZE_X = 150;
const GRID_SIZE_Y = 60;
const START_NODE = { x: 130, y: 58 };
const supermarketMap = `${process.env.PUBLIC_URL}/supermarket-map.png`;

const TARGET_NODES = itemsData.items;
const VISUALIZATION_SPEED = 10; // Lower value = faster visualization

function PathfindingGrid() {
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [path, setPath] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [gridsTraveled, setGridsTraveled] = useState(0);
  const [checkedNodes, setCheckedNodes] = useState([]);
  const [isPathfinding, setIsPathfinding] = useState(false);
  const wallsDataFile = process.env.PUBLIC_URL + "/wall.json";
  const checkedNodesRef = useRef([]);
  const animationFrameRef = useRef();

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

  const updateCheckedNodes = useCallback(() => {
    const updateBatch = () => {
      const batchSize = Math.ceil(
        checkedNodesRef.current.length / VISUALIZATION_SPEED
      );
      const batch = checkedNodesRef.current.splice(0, batchSize);
      setCheckedNodes((prev) => [...prev, ...batch]);

      if (checkedNodesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(updateBatch);
      }
    };

    if (checkedNodesRef.current.length > 0) {
      updateBatch();
    }
  }, []);

  const onNodeChecked = useCallback(
    (newNodes) => {
      checkedNodesRef.current.push(...newNodes);
      if (!animationFrameRef.current) {
        updateCheckedNodes();
      }
    },
    [updateCheckedNodes]
  );

  const handleFindPath = async () => {
    setCheckedNodes([]);
    checkedNodesRef.current = [];
    setPath([]);
    setGridsTraveled(0);
    setIsPathfinding(true);

    if (selectedTargets.length === 0) {
      setIsPathfinding(false);
      return;
    }

    const targetNodes = selectedTargets.map((label) =>
      TARGET_NODES.find((node) => node.label === label)
    );

    const onPathFound = (newPath, target) => {
      return new Promise((resolve) => {
        setPath(newPath);
        setGridsTraveled(newPath.length);
        setTimeout(() => {
          resolve();
        }, 1000); // Wait for 1 second before moving to the next target
      });
    };

    const fullPath = await dijkstraStepByStep(
      START_NODE,
      targetNodes,
      GRID_SIZE_X,
      GRID_SIZE_Y,
      obstacles,
      onNodeChecked,
      onPathFound
    );

    setPath(fullPath);
    setGridsTraveled(fullPath.length);
    setIsPathfinding(false);

    // Cancel any remaining animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setCheckedNodes([]);
  };

  const getNodeColor = (x, y) => {
    if (x === START_NODE.x && y === START_NODE.y) return "red ";
    if (path.some((point) => point.x === x && point.y === y)) return "cyan ";
    if (checkedNodes.some((point) => point.x === x && point.y === y))
      return "orange";
    if (
      selectedTargets.some(
        (label) =>
          TARGET_NODES.find((node) => node.label === label).x === x &&
          TARGET_NODES.find((node) => node.label === label).y === y
      )
    )
      return "blue";
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
        </div>

        <ul className="checkbox-container">
          {TARGET_NODES.map((target) => (
            <li className="list-item" key={target.label}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTargets.includes(target.label)}
                  onChange={() => toggleTarget(target.label)}
                  disabled={isPathfinding}
                />
                {target.label}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={handleFindPath} disabled={isPathfinding}>
          {isPathfinding ? "Mencari Rute..." : "Buat Rute Belanja"}
        </button>

        <p>Jarak yang dilalui: {gridsTraveled} kotak</p>
      </div>
    </div>
  );
}

export default PathfindingGrid;
