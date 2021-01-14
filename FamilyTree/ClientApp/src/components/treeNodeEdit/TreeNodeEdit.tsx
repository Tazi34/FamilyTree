import { Button, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Formik } from "formik";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { PersonNode } from "../../model/PersonNode";
import TreeNodeDetailsForm, {
  TreeNodeDetailsFormProps,
} from "../addNodeActionDialog/TreeNodeDetailsForm";
import treeNodeValidationSchema from "./validation/treeNodeValidationSchema";

const useStyles = makeStyles((theme: Theme) => ({
  formSubmitSection: {
    display: "flex",
    justifyContent: "center",
  },
  root: {
    padding: 20,
  },
  submitButton: {
    marginRight: 5,
  },
}));

type EditNodeProps = {
  node: PersonNode;
  onEdit: (formValues: TreeNodeDetailsFormProps) => void;
  onClose: () => void;
  onPictureSet: (data: any) => void;
};
const TreeNodeEdit = ({
  node,
  onEdit,
  onClose,
  onPictureSet,
}: EditNodeProps) => {
  const classes = useStyles();
  const details = node.personDetails;

  return (
    <div className={classes.root}>
      <Formik
        initialValues={details}
        onSubmit={(values: TreeNodeDetailsFormProps, { resetForm }) => {
          onEdit(values);
        }}
        validationSchema={treeNodeValidationSchema}
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
              <TreeNodeDetailsForm
                errors={errors}
                touched={touched}
                onPictureSet={onPictureSet}
                change={change}
                values={values}
                setFieldValue={setFieldValue}
              />

              <div className={classes.formSubmitSection}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  className={classes.submitButton}
                >
                  Submit
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default TreeNodeEdit;
