import {
  Button,
  Dialog,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Formik } from "formik";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { Sex } from "../../model/Sex";
import {
  UploadNodePictureRequestData,
  uploadTreeNodePicture,
} from "../tree/API/uploadPicture/uploadTreeNodePicture";
import TreeNodeDetailsForm from "./TreeNodeDetailsForm";
const useStyles = makeStyles((theme: Theme) => ({}));

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
const CreateNodeDialog = ({ open, onClose, onSubmit }: Props) => {
  const dispatch = useThunkDispatch();

  return (
    <Dialog open={open} onClose={onClose}>
      <Paper>
        <div>
          <Formik
            initialValues={{
              name: "",
              surname: "",
              birthday: new Date().toString(),
              description: "",
              sex: "Male" as Sex,
              picture: null,
            }}
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
                    onSubmit={(values: any) => {
                      alert(values);
                    }}
                    setFieldValue={setFieldValue}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={onClose}>
                    Back
                  </Button>
                </form>
              );
            }}
          </Formik>
        </div>
      </Paper>
    </Dialog>
  );
};

export default CreateNodeDialog;
