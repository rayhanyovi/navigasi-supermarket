// src/Dijkstra.js
import React, { Component } from "react";

class Dijkstra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNode: { row: 0, col: 0 }, // Node awal di pojok kiri atas
      targetNode: { row: 20, col: 21 }, // Node tengah
      visitedNodes: [], // Node yang sudah dikunjungi
      shortestPath: [], // Jalur terpendek
    };
  }

  handleNodeClick(node) {
    // Implementasikan algoritma Dijkstra di sini
    const { visitedNodes, shortestPath } = this.calculateShortestPath(
      this.state.startNode,
      this.state.targetNode
    );
    this.setState({ visitedNodes, shortestPath });

    // Kirim jalur terpendek ke Grid untuk disorot
    this.props.highlightShortestPath(shortestPath);
  }

  calculateShortestPath(startNode, targetNode) {
    const numRows = 50;
    const numCols = 50;

    const grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
      grid[i] = new Array(numCols).fill(1);
    }

    const visitedNodes = [];
    const distances = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
      distances[i] = new Array(numCols).fill(Infinity);
    }

    const directions = [
      [0, 1], // Right
      [1, 0], // Down
      [0, -1], // Left
      [-1, 0], // Up
      [1, 1], // Diagonal down-right
      [-1, 1], // Diagonal up-right
      [1, -1], // Diagonal down-left
      [-1, -1], // Diagonal up-left
    ];

    const startRow = startNode.row;
    const startCol = startNode.col;
    const targetRow = targetNode.row;
    const targetCol = targetNode.col;

    distances[startRow][startCol] = 0;

    const queue = [{ row: startRow, col: startCol }];

    while (queue.length > 0) {
      const { row, col } = queue.shift();

      if (row === targetRow && col === targetCol) {
        break;
      }

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < numRows &&
          newCol >= 0 &&
          newCol < numCols
        ) {
          const newDistance = distances[row][col] + 1;

          if (newDistance < distances[newRow][newCol]) {
            distances[newRow][newCol] = newDistance;
            queue.push({ row: newRow, col: newCol });
          }
        }
      }

      visitedNodes.push({ row, col });
    }

    // Reconstruct the shortest path
    const shortestPath = [];
    let row = targetRow;
    let col = targetCol;

    while (row !== startRow || col !== startCol) {
      shortestPath.unshift({ row, col });
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < numRows &&
          newCol >= 0 &&
          newCol < numCols &&
          distances[newRow][newCol] === distances[row][col] - 1
        ) {
          row = newRow;
          col = newCol;
          break;
        }
      }
    }

    return { visitedNodes, shortestPath };
  }

  render() {
    return (
      <div className="dijkstra">
        <h2>Dijkstra Pathfinding</h2>
        <p>
          Start Node: ({this.state.startNode.row}, {this.state.startNode.col})
        </p>
        <p>
          Target Node: ({this.state.targetNode.row}, {this.state.targetNode.col}
          )
        </p>
        {/* Tampilan yang menunjukkan node yang dikunjungi */}
      </div>
    );
  }
}

export default Dijkstra;
