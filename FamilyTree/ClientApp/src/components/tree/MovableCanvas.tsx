import { makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { ApplicationState } from "../../helpers";
import {
  CanvasState,
  resizeCanvas,
  transformCanvas,
} from "../canvas/reducer/canvasReducer";

const PanZoom = require("react-easy-panzoom").default;
const useStyles = makeStyles((theme: Theme) => ({
  panZoomContainer: {
    width: "100%",
    height: "100%",
  },
}));

const panZoomStyle = { width: "100%", height: "100%", overflow: "hidden" };
const MovableCanvas = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const panRef = React.useRef<any>(null);
  const canvas = useSelector<ApplicationState, CanvasState>(
    (state) => state.canvas
  );
  const onCanvasResize = () => {
    const canvasContainer = document.getElementById("panZoomContainer");
    if (canvasContainer) {
      dispatch(
        resizeCanvas({
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight,
        })
      );
    }
  };

  React.useEffect(() => {
    onCanvasResize();
    window.addEventListener("resize", onCanvasResize);
    return () => {
      window.removeEventListener("resize", onCanvasResize);
    };
  }, []);

  React.useEffect(() => {
    panRef.current.setState({ x: canvas.x, y: canvas.y, scale: canvas.scale });
  });

  console.log("MovableCanvas");

  return (
    <div id="panZoomContainer" className={classes.panZoomContainer}>
      <PanZoom
        ref={panRef}
        style={panZoomStyle}
        onStateChange={(e: any) => {
          dispatch(transformCanvas({ x: e.x, y: e.y, scale: e.scale }));
        }}
        boundaryRatioVertical={1}
        boundaryRatioHorizontal={1}
        disableDoubleClickZoom={canvas.disabledZoom}
        disableScrollZoom={canvas.disabledZoom}
      >
        {props.children}
      </PanZoom>
    </div>
  );
};
export default MovableCanvas;
