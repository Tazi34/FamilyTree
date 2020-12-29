import {
  Button,
  Dialog,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  pictureDialogContainer: {
    padding: 20,
    minWidth: 400,
    display: "flex",
    flexDirection: "column",
  },
  actionsContainer: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    marginBottom: 10,
  },
}));
type Props = {
  open: boolean;
  onClose: () => void;
};
const PicturePickerDialog = ({ open, onClose }: Props) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose}>
      <Paper className={classes.pictureDialogContainer}>
        <Typography align="center" variant="h5" className={classes.title}>
          Upload new image
        </Typography>
        <DropzoneArea
          acceptedFiles={["image/*"]}
          dropzoneText={"Drag and drop or click"}
          filesLimit={1}
          showPreviewsInDropzone={false}
          //TODO jak bedzie backend
          onChange={(files) => console.log("Files:", files)}
        />
        <div className={classes.actionsContainer}>
          <Button color="primary" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Paper>
    </Dialog>
  );
};

export default PicturePickerDialog;
