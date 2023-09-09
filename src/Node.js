import React from "react";
const Node = ({
  col,
  isStart,
  isTarget,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  row,
}) => {
  const extraClassName = isStart
    ? "node-start"
    : isTarget
    ? "node-target"
    : isWall
    ? "node-wall"
    : "";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}></div>
  );
};

export default Node;
