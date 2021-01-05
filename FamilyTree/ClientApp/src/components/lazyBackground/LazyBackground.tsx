import React from "react";

class LazyBackground extends React.Component<any, any> {
  state = { src: null };

  componentDidMount() {
    const { src, onLoad } = this.props;

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      this.setState({ src });
      onLoad();
    };
  }

  render() {
    const loadedStyle = {
      backgroundImage: `url(${this.state.src})`,
    };
    const notLoadedStyle = {
      display: "none",
    };
    return (
      <div
        {...this.props}
        style={this.state.src ? loadedStyle : notLoadedStyle}
      />
    );
  }
}
export default LazyBackground;
