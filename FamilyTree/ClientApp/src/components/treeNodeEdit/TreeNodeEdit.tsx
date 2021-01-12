import { Button, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Formik } from "formik";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { PersonNode } from "../../model/PersonNode";
import TreeNodeDetailsForm, {
  TreeNodeDetailsFormProps,
} from "../addNodeActionDialog/TreeNodeDetailsForm";

const useStyles = makeStyles((theme: Theme) => ({
  formSubmitSection: {
    display: "flex",
    justifyContent: "center",
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
  const dispatch = useThunkDispatch();

  return (
    <Formik
      initialValues={details}
      onSubmit={(values: TreeNodeDetailsFormProps, { resetForm }) => {
        onEdit(values);
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
              onPictureSet={onPictureSet}
              change={change}
              values={values}
              onSubmit={(values: any) => {
                alert(values);
              }}
              setFieldValue={setFieldValue}
            />

            <div>
              <div className={classes.formSubmitSection}>
                <Button color="primary" variant="contained" type="submit">
                  Submit
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default TreeNodeEdit;
