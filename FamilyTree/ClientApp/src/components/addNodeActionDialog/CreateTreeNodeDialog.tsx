import { Button, Dialog, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Formik } from "formik";
import * as React from "react";
import { Sex } from "../../model/Sex";
import treeNodeValidationSchema from "../treeNodeEdit/validation/treeNodeValidationSchema";
import TreeNodeDetailsForm from "./TreeNodeDetailsForm";
const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    padding: 20,
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
  },
  submitButton: {
    marginRight: 5,
  },
}));

export type CreateNodeFormData = {
  birthday: string;
  description: string;
  name: string;
  surname: string;
  sex: Sex;
  picture: File | null;
};

type Props = {
  open: boolean;
  onClose: any;
  onSubmit: (data: CreateNodeFormData) => void;
};
const CreateTreeNodeDialog = ({ open, onClose, onSubmit }: Props) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose}>
      <Paper className={classes.dialog}>
        <Formik
          initialValues={{
            name: "",
            surname: "",
            birthday: new Date().toString(),
            description: "",
            sex: "Male" as Sex,
            picture: null,
          }}
          validationSchema={treeNodeValidationSchema}
          onSubmit={(values: CreateNodeFormData) => {
            onSubmit(values);
          }}
        >
          {({
            setFieldTouched,
            handleChange,
            handleSubmit,
            values,
            setFieldValue,
            touched,
            errors,
          }) => {
            const change = (name: string, e: any) => {
              e.persist();
              handleChange(e);
              setFieldTouched(name, true, false);
            };
            return (
              <form onSubmit={handleSubmit}>
                <TreeNodeDetailsForm
                  change={change}
                  values={values}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                />
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submitButton}
                  >
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={onClose}>
                    Back
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </Dialog>
  );
};

export default CreateTreeNodeDialog;
