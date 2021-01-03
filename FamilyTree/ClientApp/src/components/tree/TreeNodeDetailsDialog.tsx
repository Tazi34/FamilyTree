import {
  Button,
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
    display: "flex",
    flexDirection: "column",
    minHeight: 200,
  },
  description: {
    maxHeight: 300,
    overflowY: "auto",
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
    //cursor: "pointer ",
    border: "solid #2f2f2f 1px",
    marginRight: 10,
    position: "relative",
  },
  editPictureIconContainer: {
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 7,
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
  canEdit: boolean;
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
  canEdit,
}: TreeNodeDialogProps) => {
  const classes = useStyles();
  const [pictureDialog, setPictureDialog] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [pictureUrl, setPictureUrl] = React.useState(
    node?.personDetails.pictureUrl
  );
  const dispatch = useThunkDispatch();
  if (!node) {
    return null;
  }
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

  //TODO brak gender

  const isMale = false;
  const genderIcon = isMale ? "fas fa-mars" : "fas fa-venus";
  const description = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo,
            ex voluptatum! Vitae expedita, iste cum, consequuntur repellendus
            facilis sequi quo pariatur quae distinctio soluta modi eum amet.
            Deserunt, quas doloremque.`;
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
          alert(JSON.stringify(values));
        }}
      >
        {({
          setFieldTouched,
          handleChange,
          handleSubmit,
          values,
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
                  <div className={classes.pictureContainer}>
                    <IconButton
                      className={classes.editPictureIconContainer}
                      onClick={handlePictureDialog}
                    >
                      <i
                        className={`fas fa-camera ${classes.editPictureIcon}`}
                      />
                    </IconButton>
                    <img src={pictureUrl} className={classes.picture} />
                  </div>
                  <div className={classes.information}>
                    {editMode && (
                      <TextField
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={change.bind(null, "name")}
                      ></TextField>
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
                      <i className={`${genderIcon} ${classes.genderIcon}`} />
                    )}
                  </div>
                  <div className={classes.actionsSection}>
                    <IconButton onClick={() => setEditMode(!editMode)}>
                      {editMode ? <PanoramaFishEyeIcon /> : <EditIcon />}
                    </IconButton>
                  </div>
                </div>
                <Divider className={classes.divider} />
                <div className={classes.descriptionSection}>
                  {editMode ? (
                    <TextField
                      multiline
                      name="description"
                      onChange={change.bind(null, "description")}
                      value={values.description}
                      className={classes.description}
                    ></TextField>
                  ) : (
                    <Typography className={classes.description}>
                      {description}
                    </Typography>
                  )}

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
