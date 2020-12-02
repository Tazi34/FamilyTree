import * as d3 from "d3";
import React, { useEffect, useState } from "react";

export function ZoomContainer(props) {
  var svgElement = null;
  const [{ x, y, k }, setTransform] = useState({ x: 0, y: 0, k: 1 });
  useEffect(() => {
    svgElement = props.getSvg();
    const svg = d3.select(svgElement);
    const zoom = d3.zoom().on("zoom", function (event, d) {
      if (event.sourceEvent.type == "mousemove") {
        props.onMouseMove(event);
      }
      setTransform(event.transform);
      return;
    });

    svg.call(zoom);
    return;
  }, [svgElement]);

  return (
    <g transform={`translate(${x}, ${100 + y}) scale(${k})`}>
      {props.children}
    </g>
  );
}
