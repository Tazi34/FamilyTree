import {
  Avatar,
  Button,
  ButtonBase,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import PanoramaFishEyeIcon from "@material-ui/icons/PanoramaFishEye";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { format, parse } from "date-fns";
import * as React from "react";
import ErrorValidationWrapper from "../UI/ErrorValidationWrapper";
import PicturePickerDialog from "../UI/PicturePickerDialog";
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
    padding: 5,
    marginTop: 10,
    minHeight: 200,
    height: 1,
  },
  description: {
    width: "100%",
    minHeight: "100%",
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
    cursor: "pointer ",
    border: "solid #2f2f2f 1px",
    marginRight: 10,
    position: "relative",
  },
  editPictureIconContainer: {
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 7,
    zIndex: 100000,
  },
  editPictureIcon: {
    fontSize: 17,
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
  descriptionLabel: {
    marginBottom: 10,
  },
  picture: {
    width: "100%",
    height: "100%",
  },
}));

const TreeNodeDetails = ({
  open,
  onClose,
  node,
  startOnEdit,
  onSuccess,
  onError,
  details,
}: any) => {
  const classes = useStyles();

  const displayDate = format(new Date(details.birthday), "d MMM yyyy");

  const genderIcon =
    details.sex === "Male"
      ? "fas fa-mars"
      : details.sex === "Female"
      ? "fas fa-venus"
      : null;
  return (
    <div>
      {/* <PicturePickerDialog
        open={pictureDialog}
        onClose={handlePictureDialog}
        onPickPicture={handleSetPicture}
      /> */}
      <div className={classes.personDialog}>
        <div className={classes.contentSection}>
          <div className={classes.information}>
            <Typography variant="h5">
              {details.name} {details.surname}
            </Typography>

            <Typography variant="h6">{displayDate}</Typography>

            {genderIcon && (
              <i className={`${genderIcon} ${classes.genderIcon}`} />
            )}
          </div>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.descriptionSection}>
          <TextField
            InputProps={{ readOnly: true }}
            multiline
            name="description"
            value={details.description}
            className={classes.description}
          />

          <Divider className={classes.bottomDivider} />
        </div>

        <div>
          <div className={classes.formSubmitSection}>
            <Button color="primary" variant="contained" onClick={onClose}>
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeNodeDetails;
