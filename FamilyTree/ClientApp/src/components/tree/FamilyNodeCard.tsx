import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { areEqualShallow } from "../../helpers/helpers";
import { FamilyNode } from "../../model/FamilyNode";

const useStyles = makeStyles<any, any>((theme: Theme) => ({
  familyCard: ({ family, canConnectTo, isConnecting }) => ({
    position: "absolute",
    transform: `translate(${family.x - 10}px,${family.y - 10}px)`,
    top: 0,
    left: 0,
    borderRadius: "50%",
    width: 20,
    height: 20,
    zIndex: -10,
    border: "1px solid " + theme.palette.primary.dark,
    cursor: "pointer",
    background: isConnecting
      ? canConnectTo
        ? theme.palette.primary.light
        : "#FFCCCB"
      : family.hidden
      ? theme.palette.background.paper
      : theme.palette.primary.dark,
  }),
}));
type Props = {
  family: FamilyNode;
  onSelect: (family: FamilyNode, event: any) => void;
  canConnectTo: boolean;
  isConnecting: boolean;
};
const FamilyNodeCard = ({
  family,
  onSelect,
  canConnectTo,
  isConnecting,
}: Props) => {
  const classes = useStyles({ family, canConnectTo, isConnecting });
  const elementId = family.id.toString();

  return (
    <div
      onClick={(e) => {
        onSelect(family, e);
      }}
      id={elementId}
      className={classes.familyCard}
    ></div>
  );
};
const areEqual = (prev: Props, next: Props) => {
  if (
    prev.isConnecting != next.isConnecting ||
    prev.canConnectTo != next.canConnectTo ||
    !areEqualShallow(prev.family, next.family)
  ) {
    return false;
  }

  return true;
};
export default React.memo(FamilyNodeCard, areEqual);
