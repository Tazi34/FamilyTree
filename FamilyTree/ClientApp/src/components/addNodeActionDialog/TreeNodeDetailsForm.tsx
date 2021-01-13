import {
  Avatar,
  Divider,
  FormControl,
  Grid,
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
import * as React from "react";
import { FormikProps } from "../../helpers/formikProps";
import { Sex } from "../../model/Sex";
import TreeNodeDescription from "../treeNodesDetails/TreeNodeDescription";
import ErrorValidationWrapper from "../UI/ErrorValidationWrapper";
import PicturePickerDialog from "../UI/PicturePickerDialog";

const imgSize = 100;
const useStyles = makeStyles((theme: Theme) => ({
  personDialog: {
    background: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
  },
  descriptionContainer: {
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
    //koretka przez Grid Material-UI
    width: imgSize + 23,
    height: imgSize,
    //cursor: "pointer ",
    marginRight: 10,

    position: "relative",
  },
  editPictureIconContainer: {
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 7,
    zIndex: 1000,
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

  picture: {
    width: "100%",
    height: "100%",
  },
}));
export type TreeNodeDetailsFormProps = {
  name: string;
  surname: string;
  birthday: string;
  description: string;
  sex: Sex;
  pictureUrl?: string;
};
type Props = {
  onPictureSet?: any;
} & FormikProps;
const TreeNodeDetailsForm = ({
  change,
  values,
  setFieldValue,
  onPictureSet,
  errors,
  touched,
}: Props) => {
  const classes = useStyles();
  const [pictureDialog, setPictureDialog] = React.useState(false);
  const [picturePreview, setPicturePreview] = React.useState<any>(
    values.pictureUrl
  );
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
      if (onPictureSet) onPictureSet(data);
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

      <div className={classes.personDialog}>
        <div className={classes.contentSection}>
          <div className={classes.pictureContainer}>
            <IconButton
              className={classes.editPictureIconContainer}
              onClick={handlePictureDialog}
            >
              <i className={`fas fa-camera ${classes.editPictureIcon}`} />
            </IconButton>
            <Avatar
              src={picturePreview ?? ""}
              alt="JJ"
              className={classes.picture}
            />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ErrorValidationWrapper
                error={errors.name}
                touched={touched.name}
              >
                <TextField
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="name"
                  label="Name"
                  value={values.name}
                  onChange={change.bind(null, "name")}
                />
              </ErrorValidationWrapper>
            </Grid>
            <Grid item xs={6}>
              <ErrorValidationWrapper
                error={errors.surname}
                touched={touched.surname}
              >
                <TextField
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="surname"
                  label="Surname"
                  value={values.surname}
                  onChange={change.bind(null, "surname")}
                />
              </ErrorValidationWrapper>
            </Grid>
            <Grid item xs={6}>
              <ErrorValidationWrapper
                error={errors.birthday}
                touched={touched.birthday}
              >
                <KeyboardDatePicker
                  autoOk
                  fullWidth
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
              </ErrorValidationWrapper>
            </Grid>
            <Grid item xs={6}>
              <ErrorValidationWrapper error={errors.sex} touched={touched.sex}>
                <FormControl fullWidth>
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
              </ErrorValidationWrapper>
            </Grid>
          </Grid>

          <div className={classes.actionsSection}></div>
        </div>

        <Divider className={classes.divider} />
        <div className={classes.descriptionContainer}>
          <TreeNodeDescription
            name="description"
            value={values.description}
            onChange={change.bind(null, "description")}
          />
        </div>
      </div>
    </div>
  );
};

export default TreeNodeDetailsForm;
