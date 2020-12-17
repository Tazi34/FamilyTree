import { EntityId } from "@reduxjs/toolkit";
import { getLinkId } from "../helpers/idHelpers";

export class Link {
  source: EntityId;
  target: EntityId;
  id: string;

  constructor(source: EntityId, target: EntityId) {
    this.id = getLinkId(source, target);
    this.source = source;
    this.target = target;
  }
}
