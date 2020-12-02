import { Icon, ListItem, ListItemAvatar, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    padding: "3px 5px 2px 5px",
  },
  accountIcon: {
    fontSize: 30,
  },
}));

const FriendEntry = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.listItem}>
      <AccountCircleIcon className={classes.accountIcon}></AccountCircleIcon>
    </div>
  );
};

export default FriendEntry;
