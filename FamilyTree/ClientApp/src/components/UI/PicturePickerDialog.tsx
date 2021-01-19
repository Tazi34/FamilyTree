import {
  Avatar,
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
    justifyContent: "center",
  },
  title: {
    marginBottom: 10,
  },
  previewContainer: {
    width: "100%",
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
  },
  preview: {
    height: 100,
    width: 100,
  },
}));
type Props = {
  open: boolean;
  onClose: () => void;
  onPickPicture: (data: any) => void;
};
const PicturePickerDialog = ({ open, onClose, onPickPicture }: Props) => {
  const classes = useStyles();

  const [picturePreview, setPicturePreview] = React.useState<string | null>("");
  const [file, setFile] = React.useState<any>(null);

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e) {
          setPicturePreview(e.target?.result as any);
        }
      };
      fileReader.readAsDataURL(files[0]);
      setFile(files[0]);
    }
  };

  const handlePictureSubmit = () => {
    setPicturePreview("");
    onPickPicture(file);
    setFile(null);
  };
  const handleClose = () => {
    setPicturePreview("");
    setFile(null);
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <Paper className={classes.pictureDialogContainer}>
        <Typography align="center" variant="h5" className={classes.title}>
          Upload new image
        </Typography>
        <div className={classes.previewContainer}>
          <Avatar src={picturePreview ?? ""} className={classes.preview} />
        </div>
        <DropzoneArea
          maxFileSize={5 * 1024 * 1024}
          acceptedFiles={["image/*"]}
          dropzoneText={"Drag and drop or click"}
          filesLimit={1}
          showPreviewsInDropzone={false}
          onChange={handleFileUpload}
        />
        <div className={classes.actionsContainer}>
          {Boolean(picturePreview) && (
            <Button
              color="primary"
              variant="contained"
              onClick={handlePictureSubmit}
            >
              Apply
            </Button>
          )}

          <Button
            color="primary"
            variant={Boolean(picturePreview) ? "outlined" : "contained"}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </Paper>
    </Dialog>
  );
};

export default PicturePickerDialog;
