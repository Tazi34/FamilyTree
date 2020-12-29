import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { Point } from "./Point";
import ZoomInner from "./ZoomInner";
type Zoom = {
  x: number;
  y: number;
  k: number;
};

type Props = {
  getSvg: Function;
  initialZoom: Zoom;
  children: any;
};
export function ZoomContainer(props: Props) {
  var svgElement = null;
  const [zoom, setZoom] = useState<Zoom>(props.initialZoom);
  useEffect(() => {
    svgElement = props.getSvg();
    const svg = d3.select(svgElement);
    const zoomHandler = d3.zoom().on("zoom", function (event, d) {
      setZoom(event.transform);
      return;
    });

    svg.call(zoomHandler);
    return;
  }, [svgElement]);
  return (
    <div id="zoom-container">
      <ZoomInner x={zoom.x} y={zoom.y} k={zoom.k}>
        {props.children}
      </ZoomInner>
    </div>
  );
}
