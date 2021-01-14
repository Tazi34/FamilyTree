import * as React from "react";
import LinkComponent, { LinkLoaded } from "./LinkComponent";

class Links extends React.Component<any> {
  render() {
    return (
      <svg
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          top: 0,
          left: 0,
          zIndex: -100000,
          overflow: "visible",
        }}
      >
        {this.props.links.map((loadedLink: LinkLoaded) => (
          <LinkComponent
            familyToChild={loadedLink.source.isFamily}
            key={loadedLink.linkId}
            linkId={loadedLink.linkId.toString()}
            source={{ x: loadedLink.source.x, y: loadedLink.source.y }}
            target={{ x: loadedLink.target.x, y: loadedLink.target.y }}
          />
        ))}
        {this.props.children}
      </svg>
    );
  }
}

export default Links;
