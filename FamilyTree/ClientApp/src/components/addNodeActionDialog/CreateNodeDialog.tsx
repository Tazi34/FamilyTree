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
import PersonDetailsForm from "./PersonDetailsForm";
const useStyles = makeStyles((theme: Theme) => ({}));

export type CreateNodeFormData = {
  birthday: string;
  description: string;
  name: string;
  surname: string;
  pictureUrl: string;
  sex: Sex;
};

type Props = {
  open: boolean;
  onClose: any;
  onSubmit: (data: CreateNodeFormData) => void;
};
const CreateNodeDialog = ({ open, onClose, onSubmit }: Props) => {
  const dispatch = useThunkDispatch();

  const handlePictureUpload = (data: UploadNodePictureRequestData) => {
    return dispatch(uploadTreeNodePicture(data));
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <Paper>
        <Typography>Create new node</Typography>
        <div>
          <Formik
            initialValues={{
              name: "",
              surname: "",
              birthday: new Date().toString(),
              description: "",
              sex: "Male" as Sex,
              pictureUrl: "",
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
                  <PersonDetailsForm
                    change={change}
                    onPictureUpload={handlePictureUpload}
                    values={values}
                    onSubmit={(values: any) => {
                      alert(values);
                    }}
                    setFieldValue={setFieldValue}
                  />
                  <Button type="submit">Submit</Button>
                  <Button onClick={onClose}>Back</Button>
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
