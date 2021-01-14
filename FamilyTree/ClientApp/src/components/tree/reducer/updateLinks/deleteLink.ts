import { createActionWithPayload } from "../../../../helpers/helpers";
import { treeActionsPrefix, linksActionsPrefix } from "../treeReducer";

export const deleteLink = createActionWithPayload<string>(
  `${treeActionsPrefix}/${linksActionsPrefix}/linkDeleted`
);
