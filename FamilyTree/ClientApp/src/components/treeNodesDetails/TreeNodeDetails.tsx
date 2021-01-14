import {
  Avatar,
  Button,
  Divider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { format } from "date-fns";
import * as React from "react";
import { PersonInformation } from "../../model/PersonNode";
import UserProfilePreview from "../userProfile/UserProfilePreview";
import TreeNodeDescription from "./TreeNodeDescription";
const imgSize = 128;

const useStyles = makeStyles((theme: Theme) => ({
  personDialog: {
    padding: 20,
    background: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      minWidth: 600,
    },
  },
  descriptionSection: {
    marginTop: 10,
  },

  contentSection: { display: "flex" },
  information: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    marginRight: 5,
  },
  pictureContainer: {
    width: imgSize,
    height: imgSize,
    marginRight: 10,
    position: "relative",
  },
  picture: {
    width: "100%",
    height: "100%",
  },

  actionsSection: {
    display: "flex",
    flexDirection: "column",
  },
  genderIcon: {
    fontSize: 25,
  },
  divider: {
    marginTop: 20,
    marginBottom: 5,
  },
  formSubmitSection: {
    display: "flex",
    justifyContent: "center",
  },
  bottomDivider: {
    marginTop: 15,
    marginBottom: 10,
  },
}));
type Props = {
  onClose: any;
  details: PersonInformation;
};
const TreeNodeDetails = ({ onClose, details }: Props) => {
  const classes = useStyles();

  const displayDate = format(new Date(details.birthday), "d MMM yyyy");

  return (
    <div>
      <div className={classes.personDialog}>
        <UserProfilePreview profile={details} />

        <Divider className={classes.divider} />
        <div className={classes.descriptionSection}>
          <TreeNodeDescription value={details.description} readOnly />
        </div>

        <div className={classes.formSubmitSection}>
          <Button color="primary" variant="contained" onClick={onClose}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TreeNodeDetails;
