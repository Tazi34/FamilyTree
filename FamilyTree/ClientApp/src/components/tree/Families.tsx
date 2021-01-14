import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import FamilyNodeCard from "./FamilyNodeCard";
import { FamilyNode } from "../../model/FamilyNode";
import { selectAllFamilies } from "./reducer/treeReducer";

const useStyles = makeStyles((theme: Theme) => ({}));

const Families = (props: any) => {
  return (
    <div>
      {props.families.map((family: FamilyNode) => (
        <FamilyNodeCard
          isConnecting={props.isConnecting}
          canConnectTo={props.possibleConnections.includes(family.id)}
          key={family.id}
          family={family}
          onSelect={props.onSelect}
        />
      ))}
    </div>
  );
};

export default Families;
