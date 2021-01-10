import {
  Avatar,
  Button,
  ButtonBase,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";

import { Theme } from "@material-ui/core/styles";
import { format, parse } from "date-fns";
import * as React from "react";
import { PersonNode } from "./model/PersonNode";
import EditIcon from "@material-ui/icons/Edit";
import PanoramaFishEyeIcon from "@material-ui/icons/PanoramaFishEye";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Formik } from "formik";
import { Sex } from "../../model/Sex";
import PicturePickerDialog from "../UI/PicturePickerDialog";
import { useDispatch } from "react-redux";
import { useThunkDispatch } from "../..";
import { uploadTreeNodePictureRequest } from "./reducer/updateNodes/setNodePicture";
import { updateTreeNode } from "./reducer/updateNodes/updateNode";
import { UpdateNodeRequestData } from "./API/updateNode/updateNodeRequest";
import ErrorValidationWrapper from "../UI/ErrorValidationWrapper";
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
export type TreeNodeDialogProps = {
  open: boolean;
  node: PersonNode | null;
  onClose: () => void;
  startOnEdit?: boolean;
  onSuccess: any;
  onError: any;
};
type FormProps = {
  name: string;
  surname: string;
  birthday: string;
  description: string;
  sex: Sex;
};

const TreeNodeDetailsDialog = ({
  open,
  onClose,
  node,
  startOnEdit,
  onSuccess,
  onError,
}: TreeNodeDialogProps) => {
  const classes = useStyles();
  const [pictureDialog, setPictureDialog] = React.useState(false);
  const [editMode, setEditMode] = React.useState(Boolean(startOnEdit));
  const [pictureUrl, setPictureUrl] = React.useState(
    node?.personDetails.pictureUrl
  );

  React.useEffect(() => {
    if (pictureUrl !== node?.personDetails.pictureUrl) {
      setPictureUrl(node?.personDetails.pictureUrl);
    }
  });

  const dispatch = useThunkDispatch();
  if (!node) {
    return null;
  }
  const canEdit = node.canEdit;
  const handlePictureDialog = () => {
    setPictureDialog(!pictureDialog);
  };

  const handleSetPicture = (data: any) => {
    if (data) {
      dispatch(
        uploadTreeNodePictureRequest({
          nodeId: node.id as number,
          picture: data,
        })
      ).then((response: any) => {
        if (response.error) {
          //TODO ERROR
        } else {
          console.log(response);
          setPictureUrl(response.payload.data.pictureUrl);
          setPictureDialog(false);
        }
      });
    }
  };
  const details = node.personDetails;

  //TODO konwersja daty wczesniej
  const displayDate = format(new Date(details.birthday), "d MMM yyyy");
  const initialDate = format(new Date(details.birthday), "d.MM.yyyy");

  const genderIcon =
    details.sex === "Male"
      ? "fas fa-mars"
      : details.sex === "Female"
      ? "fas fa-venus"
      : null;
  console.log(details);
  const description = details.description;
  return (
    <Dialog open={open} onClose={onClose}>
      <PicturePickerDialog
        open={pictureDialog}
        onClose={handlePictureDialog}
        onPickPicture={handleSetPicture}
      />
      <Formik
        initialValues={details}
        onSubmit={(values: FormProps, { resetForm }) => {
          console.log(values.birthday);
          var date = new Date(values.birthday);
          date.setHours(5);

          const data: UpdateNodeRequestData = {
            ...values,
            nodeId: node.id as number,
            children: node.children as number[],
            fatherId: (node.fatherId ?? 0) as number,
            motherId: (node.motherId ?? 0) as number,
            partners: node.partners as number[],
            userId: node.userId as any,
            treeId: node.treeId,
            sex: values.sex,
            birthday: date.toISOString(),
          };
          dispatch(updateTreeNode(data)).then((resp: any) => {
            if (resp.error) {
              onError("Could not modify node.");
            } else {
              onSuccess("Tree node modified. ");
              onClose();
            }
          });
        }}
      >
        {({
          setFieldTouched,
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => {
          const change = (name: string, e: any) => {
            e.persist();
            handleChange(e);
            setFieldTouched(name, true, false);
          };
          return (
            <form onSubmit={handleSubmit}>
              <div className={classes.personDialog}>
                <div className={classes.contentSection}>
                  <div
                    className={classes.pictureContainer}
                    onClick={handlePictureDialog}
                  >
                    {canEdit && (
                      <IconButton className={classes.editPictureIconContainer}>
                        <i
                          className={`fas fa-camera ${classes.editPictureIcon}`}
                        />
                      </IconButton>
                    )}

                    <Avatar
                      component={ButtonBase}
                      src={pictureUrl}
                      variant="square"
                      className={classes.picture}
                    />
                  </div>
                  <div className={classes.information}>
                    {editMode && (
                      <ErrorValidationWrapper
                        error={errors.name}
                        touched={touched.name}
                      >
                        <TextField
                          name="name"
                          label="Name"
                          value={values.name}
                          onChange={change.bind(null, "name")}
                        ></TextField>
                      </ErrorValidationWrapper>
                    )}
                    {editMode ? (
                      <TextField
                        name="surname"
                        label="Surname"
                        value={values.surname}
                        onChange={change.bind(null, "surname")}
                      ></TextField>
                    ) : (
                      <Typography variant="h5">
                        {details.name} {details.surname}
                      </Typography>
                    )}
                    {editMode ? (
                      <KeyboardDatePicker
                        label="Birthday"
                        name="birthday"
                        disableToolbar
                        variant="inline"
                        format="dd.MM.yyyy"
                        value={values.birthday}
                        onChange={(_, value) => {
                          console.log(value);
                          var date = parse(
                            value as string,
                            "dd.MM.yyyy",
                            new Date()
                          );
                          setFieldValue("birthday", date);
                        }}
                      />
                    ) : (
                      <Typography variant="h6">{displayDate}</Typography>
                    )}

                    {editMode ? (
                      <FormControl>
                        <InputLabel id="gender-select">Gender</InputLabel>
                        <Select
                          labelId="gender-select"
                          value={values.sex}
                          name="sex"
                          onChange={change.bind(null, "sex")}
                        >
                          <MenuItem value={"Male"}>Male</MenuItem>
                          <MenuItem value={"Female"}>Female</MenuItem>
                          <MenuItem value={"NotSure"}>Other</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      genderIcon && (
                        <i className={`${genderIcon} ${classes.genderIcon}`} />
                      )
                    )}
                  </div>
                  <div className={classes.actionsSection}>
                    {canEdit && (
                      <IconButton onClick={() => setEditMode(!editMode)}>
                        {editMode ? <PanoramaFishEyeIcon /> : <EditIcon />}
                      </IconButton>
                    )}
                  </div>
                </div>
                <Divider className={classes.divider} />
                <div className={classes.descriptionSection}>
                  <TextField
                    InputProps={{ readOnly: !editMode }}
                    multiline
                    name="description"
                    onChange={change.bind(null, "description")}
                    value={values.description}
                    className={classes.description}
                  />

                  <Divider className={classes.bottomDivider} />
                </div>

                <div>
                  {editMode ? (
                    <div className={classes.formSubmitSection}>
                      <Button color="primary" variant="contained" type="submit">
                        Submit
                      </Button>
                      <Button onClick={() => setEditMode(!editMode)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className={classes.formSubmitSection}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={onClose}
                      >
                        Back
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default TreeNodeDetailsDialog;
