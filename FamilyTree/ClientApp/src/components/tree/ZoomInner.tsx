import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

const ZoomInner = (props: any) => {
  const classes = useStyles();

  return (
    <div
      id="zoom-inner"
      style={{
        width: "100%",
        height: "100%",
        transform: `translate(${props.x}px, ${props.y}px) scale(${props.k})`,
      }}
    >
      {props.children}
    </div>
  );
};

export default ZoomInner;
