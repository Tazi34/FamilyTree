import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { TreeInformation } from "../../model/TreeInformation";
import CreateTreeDialog from "./CreateTreeDialog";
import TreesList from "./TreesList";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    margin: "0 auto",
    height: "100%",
    maring: "0 auto",
    diplay: "flex",
    alignItems: "center",
  },
  paper: {
    maxWidth: 350,
    margin: "100px 10px",
    position: "fixed",
    padding: "10px 5px",
    width: "calc(16%)",
  },
  flexGrow: {
    flex: 0.2,
  },
  createButton: {
    maxHeight: 40,
  },
  treeList: {
    width: "100%", // height: "80%",
  },
  flexBox: {
    height: "400px",
  },
  title: {
    color: theme.palette.primary.dark,
  },
}));
type Props = {
  userTrees: TreeInformation[];
  onTreeSelect: (tree: TreeInformation) => void;
  onTreeCreate: (treeName: string) => void;
  isOwner: boolean;
  loading: boolean;
};
const UserTreePanel = ({
  userTrees,
  onTreeSelect,
  onTreeCreate,
  isOwner,
  loading,
}: Props) => {
  const classes = useStyles();

  const [createTreeDialogOpen, setCreateTreeDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setCreateTreeDialogOpen(true);
  };

  const handleClose = () => {
    setCreateTreeDialogOpen(false);
  };
  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      {/* <div className={classes.flexGrow}></div> */}
      {!loading && isOwner && (
        <div style={{ width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            className={classes.createButton}
            onClick={handleClickOpen}
            fullWidth
          >
            Create
          </Button>
          <CreateTreeDialog
            open={createTreeDialogOpen}
            onClose={handleClose}
            onSubmit={onTreeCreate}
          />
        </div>
      )}
      <div className={classes.treeList}>
        <TreesList
          loading={loading}
          onTreeSelect={onTreeSelect}
          trees={userTrees}
        ></TreesList>
      </div>
    </Box>
  );
};

export default UserTreePanel;
