import React from "react";

// class LazyBackground extends React.Component<any, any> {
//   state = { src: null };

//   componentDidMount() {
//     const { src, onLoad } = this.props;

//     const imageLoader = new Image();
//     imageLoader.src = src;

//     imageLoader.onload = () => {
//       document.body.style.backgroundImage = `url(${src})`;
//       this.setState({ src });
//       if (onLoad) onLoad();
//     };
//   }

//   render() {
//     const loadedStyle = {
//       backgroundImage: `url(${this.state.src})`,
//     };
//     const notLoadedStyle = {
//       background: "white",
//     };

//     return (
//       <div
//         {...this.props}
//         style={this.state.src ? loadedStyle : notLoadedStyle}
//       >
//         {this.props.children}
//       </div>
//     );
//   }
// }
// export default LazyBackground;
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
      //document.body.style.backgroundImage = "none";
    }
  });
};
