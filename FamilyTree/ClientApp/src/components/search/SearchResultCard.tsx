import { ButtonBase, Icon, makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

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
  imageContainer: {
    borderRadius: "50%",
    border: "1px solid " + theme.palette.primary.dark,

    marginRight: 8,
  },
  icon: {
    display: "table-cell",
    verticalAlign: "middle",
    textAlign: "center",
    margin: 5,
    color: theme.palette.primary.dark,
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
    <ButtonBase className={classes.card} onClick={() => onSelect(entityId)}>
      <div className={classes.imageContainer}>
        {pictureUrl ? (
          <img src={pictureUrl} />
        ) : user ? (
          <Icon className={`fas fa-user ${classes.icon}`}></Icon>
        ) : (
          <Icon className={`fas fa-tree ${classes.icon}`}></Icon>
        )}
      </div>
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
