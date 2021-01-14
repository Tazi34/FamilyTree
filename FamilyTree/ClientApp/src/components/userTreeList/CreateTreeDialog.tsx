import { Button, makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Formik } from "formik";
import React from "react";
import ValidationErrorText from "../UI/ValidationErrorText";
import createTreeValidationSchema from "./createTreeValidationSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (treeName: string) => void;
};
const CreateTreeDialog = ({ open, onClose, onSubmit }: Props) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new family tree</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create new family tree please provide tree name.
          </DialogContentText>
          <Formik
            initialValues={{ treeName: "" }}
            onSubmit={(values) => {
              onSubmit(values.treeName);
              onClose();
            }}
            validationSchema={createTreeValidationSchema}
          >
            {({
              setFieldTouched,
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
            }) => {
              const change = (name: string, e: any) => {
                e.persist();
                handleChange(e);
                setFieldTouched(name, true, false);
              };
              return (
                <form onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Tree name"
                    name="treeName"
                    fullWidth
                    value={values.treeName}
                    onChange={change.bind(null, "message")}
                  />
                  <ValidationErrorText error={errors.treeName} />

                  <DialogActions>
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                      Back
                    </Button>
                  </DialogActions>
                </form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTreeDialog;
