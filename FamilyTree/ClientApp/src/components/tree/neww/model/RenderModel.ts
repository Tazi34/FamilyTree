const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

export interface TreeNode {
  children: TreeNode[];
  data: any;
  id: string;
  layer: number;
  x: number;
  y: number;
}
