import { makeStyles, MenuItem, Popover } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  results: any[];
};
const SearchResults = ({ anchor, open, onClose }: Props) => {
  const classes = useStyles();
  return (
    <Popover
      anchorEl={anchor}
      keepMounted
      open={open}
      onClose={onClose}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
    >
      <MenuItem>Profile</MenuItem>
    </Popover>
  );
};

export default SearchResults;
