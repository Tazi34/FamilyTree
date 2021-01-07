import {
  Avatar,
  ButtonBase,
  Icon,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import { AccountCircle } from "@material-ui/icons";
const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: "100%",
    padding: 15,
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottom: "1px solid",
    borderColor: theme.palette.primary.dark,
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
    <ButtonBase
      className={classes.card}
      onClick={() => {
        onSelect(entityId);
      }}
    >
      <Avatar className={classes.image} src={pictureUrl ?? ""}>
        {user ? <AccountCircle /> : <AccountTreeOutlinedIcon />}
      </Avatar>

      <div className={classes.textContainer}>
        <Typography variant="body1">{text}</Typography>
        <Typography variant="body2" align="left">
          {user ? "User" : "Tree"}
        </Typography>
      </div>
    </ButtonBase>
  );
};

export default SearchResultCard;
