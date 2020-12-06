import { Tooltip } from "@material-ui/core";
import * as React from "react";

const TooltipMouseFollow = ({ children, ...props }: any) => {
  const [position, setPosition] = React.useState<any>({
    x: undefined,
    y: undefined,
  });

  return (
    <Tooltip
      {...props}
      onMouseMove={(e) => setPosition({ x: e.pageX, y: e.pageY })}
      PopperProps={{
        anchorEl: {
          clientHeight: 0,
          clientWidth: 0,
          getBoundingClientRect: () => ({
            top: position.y,
            left: position.x,
            right: position.x,
            bottom: position.y,
            width: 0,
            height: 0,
          }),
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipMouseFollow;
