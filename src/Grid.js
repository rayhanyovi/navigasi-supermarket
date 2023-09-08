// src/Grid.js
import React, { Component } from "react";
import Dijkstra from "./Dijkstra";
import "./Grid.css";

class Grid extends Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      shortestPath: [], // Jalur terpendek
    };
  }

  componentDidMount() {
    // Inisialisasi nodes di sini
    const nodes = this.initializeNodes();
    this.setState({ nodes });
  }

  initializeNodes() {
    const nodes = [];
    const gridSize = 20; // Ukuran setiap node dalam grid
    const numRows = 50;
    const numCols = 50;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const node = {
          row: row,
          col: col,
          isStart: row === 0 && col === 0, // Tandai StartNode
          isTarget: row === 20 && col === 21, // Tandai TargetNode
          isShortestPath: false, // Inisialisasi node bukan sebagai jalur terpendek
        };
        nodes.push(node);
      }
    }

    return nodes;
  }

  handleNodeClick(node) {
    // Kirim informasi node yang diklik ke komponen Dijkstra
    this.refs.dijkstra.handleNodeClick(node);
  }

  // Fungsi untuk mengubah warna jalur terpendek menjadi biru
  highlightShortestPath(path) {
    const updatedNodes = this.state.nodes.map((node) => {
      return {
        ...node,
        isShortestPath: path.some(
          (p) => p.row === node.row && p.col === node.col
        ),
      };
    });
    this.setState({ nodes: updatedNodes, shortestPath: path });
  }

  render() {
    return (
      <div className="grid">
        {this.state.nodes.map((node) => (
          <div
            key={`node-${node.row}-${node.col}`}
            className={`node ${node.isStart ? "start-node" : ""} ${
              node.isTarget ? "target-node" : ""
            } ${node.isShortestPath ? "shortest-path-node" : ""}`}
            style={{
              width: "20px",
              height: "20px",
              border: "1px solid #ccc",
              display: "inline-block",
            }}
            onClick={() => this.handleNodeClick(node)}></div>
        ))}
        <Dijkstra
          ref="dijkstra"
          highlightShortestPath={(path) => this.highlightShortestPath(path)}
        />
      </div>
    );
  }
}

export default Grid;
