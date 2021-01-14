import { createActionWithPayload } from "./../../../../helpers/helpers";
export const changeNodeVisibility = createActionWithPayload<number>(
  "tree/node/visibilityChanged"
);
