import { Button, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  onSelectAddChild: () => void;
  onSelectAddParent: () => void;
  onSelectAddSibling: () => void;
  onSelectAddPartner: () => void;
};
const SelectAddNodeAction = ({
  onSelectAddChild,
  onSelectAddParent,
  onSelectAddSibling,
  onSelectAddPartner,
}: Props) => {
  const classes = useStyles();
  return (
    <div>
      <Button onClick={onSelectAddChild}>Add child</Button>
      <Button onClick={onSelectAddParent}>Add parent</Button>
      <Button onClick={onSelectAddSibling}>Add sibling</Button>
      <Button onClick={onSelectAddPartner}>Add partner</Button>
    </div>
  );
};

export default SelectAddNodeAction;
