import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { parse } from "date-fns";
import { Formik } from "formik";
import * as React from "react";
import { FormikProps } from "../../helpers/formikProps";
import { Sex } from "../../model/Sex";
import { UploadNodePictureRequestData } from "../tree/API/uploadPicture/uploadTreeNodePicture";
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
export type FormProps = {
  name: string;
  surname: string;
  birthday: string;
  description: string;
  sex: Sex;
};
type Props = {} & FormikProps;
const PersonDetailsForm = ({ change, values, setFieldValue }: Props) => {
  const classes = useStyles();
  const [pictureDialog, setPictureDialog] = React.useState(false);
  const [picturePreview, setPicturePreview] = React.useState<any>(null);
  const handleSetPicture = (data: any) => {
    if (data) {
      values.picture = data;
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e) {
          setPicturePreview(e.target?.result as any);
        }
      };
      fileReader.readAsDataURL(data);
    }
    setPictureDialog(false);
  };

  const handlePictureDialog = () => {
    setPictureDialog(!pictureDialog);
  };

  return (
    <div>
      <PicturePickerDialog
        open={pictureDialog}
        onClose={handlePictureDialog}
        onPickPicture={handleSetPicture}
      />
      {/* <Formik
        initialValues={{
          name: "",
          surname: "",
          birthday: new Date().toString(),
          description: "",
          sex: "Male" as Sex,
        }}
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

          return (
            <form onSubmit={handleSubmit}> */}
      <div className={classes.personDialog}>
        <div className={classes.contentSection}>
          <div className={classes.pictureContainer}>
            <IconButton
              className={classes.editPictureIconContainer}
              onClick={handlePictureDialog}
            >
              <i className={`fas fa-camera ${classes.editPictureIcon}`} />
            </IconButton>
            <img src={picturePreview ?? ""} className={classes.picture} />
          </div>
          <div className={classes.information}>
            <TextField
              name="name"
              label="Name"
              value={values.name}
              onChange={change.bind(null, "name")}
            ></TextField>
            <TextField
              name="surname"
              label="Surname"
              value={values.surname}
              onChange={change.bind(null, "surname")}
            ></TextField>
            <KeyboardDatePicker
              label="Birthday"
              name="birthday"
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              value={values.birthday}
              onChange={(_, value) => {
                var date = parse(value as string, "dd.MM.yyyy", new Date());

                setFieldValue("birthday", date);
              }}
            />
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
          </div>
          <div className={classes.actionsSection}>
            {/* <IconButton onClick={() => setEditMode(!editMode)}>
                      {editMode ? <PanoramaFishEyeIcon /> : <EditIcon />}
                    </IconButton> */}
          </div>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.descriptionSection}>
          <TextField
            multiline
            name="description"
            onChange={change.bind(null, "description")}
            value={values.description}
            className={classes.description}
          />

          <Divider className={classes.bottomDivider} />
        </div>
      </div>
      {/* </form>
          );
        }}
      </Formik> */}
    </div>
  );
};

export default PersonDetailsForm;