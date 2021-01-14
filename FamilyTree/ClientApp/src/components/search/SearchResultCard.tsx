import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import * as React from "react";
const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: "100%",
    padding: 15,

    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    marginRight: 8,
  },

  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
}));
type Props = {
  pictureUrl: string | null;
  text: string;
  entityId: number;
  user: boolean;
  onSelect: (id: number) => any;
};
const SearchResultCard = ({
  text,
  pictureUrl,
  user,
  onSelect,
  entityId,
}: Props) => {
  const classes = useStyles();

  return (
    <ListItem
      button
      className={classes.card}
      onClick={() => {
        onSelect(entityId);
      }}
    >
      <ListItemAvatar>
        <Avatar className={classes.image} src={pictureUrl ?? ""}>
          {user ? <AccountCircle /> : <AccountTreeOutlinedIcon />}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={text}
        secondary={user ? "User" : "Tree"}
      ></ListItemText>
    </ListItem>
  );
};

export default SearchResultCard;
