import React from "react";

export default ({ background, onLoad }: any) => {
  React.useEffect(() => {
    if (background) {
      if (`url(${background})` === document.body.style.backgroundImage) {
        if (onLoad) onLoad();
        return;
      }
      const imageLoader = new Image();
      imageLoader.src = background;

      imageLoader.onload = () => {
        document.body.style.backgroundImage = `url(${background})`;
        if (onLoad) onLoad();
      };
    } else {
    }
  });
};
