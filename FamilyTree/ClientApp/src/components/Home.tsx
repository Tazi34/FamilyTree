import * as React from "react";
import { connect } from "react-redux";
import Tree from "./tree/Tree";

const Home = () => <Tree />;

export default connect()(Home);
