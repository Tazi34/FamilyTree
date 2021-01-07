import { createAction } from "@reduxjs/toolkit";
import { chatActionsPrefix } from "../chatReducer";

export const closeAllChats = createAction(`${chatActionsPrefix}/closeAllChats`);
