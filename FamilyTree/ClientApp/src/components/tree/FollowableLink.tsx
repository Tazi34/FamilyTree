import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import DrawableLink from "./DrawableLink";

const useStyles = makeStyles((theme: Theme) => ({}));

const FollowableLink = (props: any) => {
  const [target, setTarget] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    document.onmousemove = (event: any) => {
      const element = document.getElementById("tree-canvas");
      if (element) {
        var bounds = element!.getBoundingClientRect();

        const x = (event.x - bounds.left - props.positionX) / props.scale;
        const y = (event.y - bounds.top - props.positionY) / props.scale;
        setTarget({ x, y });
      }
    };
    return () => {
      document.onmousemove = null;
    };
  });
  if (!props.enabled) {
    return null;
  }
  return <DrawableLink source={props.source} target={target}></DrawableLink>;
};

export default FollowableLink;
