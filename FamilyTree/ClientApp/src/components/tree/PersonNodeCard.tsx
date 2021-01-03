import {
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { format } from "date-fns";
import * as React from "react";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import { Node } from "./model/NodeClass";
import { PersonNode } from "./model/PersonNode";
import DeleteIcon from "@material-ui/icons/Delete";
import { formatDate } from "../../helpers/formatters";

const imageSize = 57;
const dividerScale = 0.25;
const addIconSize = 30;
const useStyles = makeStyles((theme: Theme) => ({
  personRoot: {
    position: "absolute",
    transform: `translate(${-RECT_WIDTH / 2}px,${-RECT_HEIGHT / 2}px)`,
    top: 0,
    left: 0,
    height: RECT_HEIGHT + "px",
    width: RECT_WIDTH + "px",
    borderRadius: 10,
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    border: "solid",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  buttonBase: {
    padding: 8,
    background: theme.palette.primary.light,
    display: "flex",
    alignItems: "start",

    width: "100%",
    height: "100%",
  },
  pictureContainer: {
    marginRight: 10,
  },
  pictureContainer2: {
    position: "absolute",
    top: dividerScale * RECT_HEIGHT - imageSize / 2,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  addButtonContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: `rgba(0, 0, 0, 0)`,
  },
  addIcon: {
    padding: 0,
    borderRadius: "50%",

    background: "white",
    transform: `translateY(-${addIconSize / 2}px)`,
  },
  addIconSvg: {
    fontSize: addIconSize,
    color: theme.palette.primary.light,

    padding: 0,
  },
  profilePicture: {
    width: imageSize,
    height: imageSize,
    borderRadius: "50%",
    border: `2px solid ${theme.palette.primary.light}`,
  },
  defaultProfileIcon: {
    fontSize: imageSize,
  },
  deleteIcon: {
    padding: 0,
  },
  filler: {
    flexGrow: 1,
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  background: {
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    border: "solid",
    zIndex: -10,
  },
  backgroundColorTheme: {
    height: RECT_HEIGHT * dividerScale,
  },
  contentContainer: {
    display: "flex",

    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  topFiller: {
    height: RECT_HEIGHT * dividerScale + imageSize / 2,
  },
  nameSection: {
    marginTop: 5,
  },
  dateSection: {},
  overflowHidden: {
    borderRadius: 10,

    overflow: "hidden",
  },
  actions: {
    alignSelf: "flex-end",
    width: "100%",
    display: "flex",
  },
  visible: {
    visibility: "visible",
  },
  hidden: {
    visibility: "hidden",
  },
}));

type Props = {
  onNodeDelete: (id: number) => void;
  onSiblingAdd: (id: number, data: CreateNodeRequestData) => void;

  onParentAdd: (id: number, data: CreateNodeRequestData) => void;
  onPartnerAdd: (id: number, data: CreateNodeRequestData) => void;
  onChildAdd: (
    data: CreateNodeRequestData,
    firstParent: number,
    secondParent?: number
  ) => void;

  onNodeMove: (node: Node, x: number, y: number) => void;
  onMoveNodeOnCanvas: (e: DragEvent, node: Node) => void;
  onNodeSelect: (node: PersonNode) => void;

  person: PersonNode;
};

const PersonNodeCard = ({
  person,
  onParentAdd,
  onNodeDelete,
  onNodeMove,
  onMoveNodeOnCanvas,
  onNodeSelect,
  onPartnerAdd,
  onChildAdd,
  onSiblingAdd,
}: Props) => {
  const elementId = "n" + person.id;
  const classes = useStyles({ x: person.x, y: person.y });
  const newPerson: CreateNodeRequestData = {
    treeId: person.treeId,
    name: "New",
    surname: "Node",
    birthday: "2020-12-16T20:29:42.677Z",
    description: "Cool description",
    pictureUrl: "",
    userId: 0,
    fatherId: 0,
    sex: "Male",
    motherId: 0,
    children: [],
    partners: [],
    x: 0,
    y: 0,
  };
  const handleParentAdd = (e: React.MouseEvent) => {
    onParentAdd(person.id as number, newPerson);
  };
  const handlePartnerAdd = (e: React.MouseEvent) => {
    onPartnerAdd(person.id as number, newPerson);
  };
  const handleSiblingAdd = (e: React.MouseEvent) => {
    onSiblingAdd(person.id as number, newPerson);
  };
  const handleNodeDelete = () => {
    onNodeDelete(person.id as number);
  };
  const handleChildAdd = () => {
    onChildAdd(newPerson, person.id as number);
  };
  const handleNodeSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    onNodeSelect(person);
  };
  const details = Object.assign({}, person.personDetails);
  if (!Boolean(details.pictureUrl)) {
    details.pictureUrl = `https://eu.ui-avatars.com/api/?name=${details.name}+${details.surname}`;
  }
  const hasPicture = Boolean(details.pictureUrl);
  let displayDate = formatDate(details.birthday);

  const preventMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const canAddParent = !(person.motherId && person.fatherId);
  console.log("NODEE");

  return (
    <Paper
      id={elementId}
      component={"span"}
      className={`${classes.personRoot}`}
      onMouseUp={handleNodeSelect}
    >
      <div className={classes.addButtonContainer}>
        {canAddParent && (
          <Tooltip title="Add parent" placement="top">
            <IconButton
              id="add-icon"
              className={`${classes.addIcon}`}
              onClick={handleParentAdd}
              onMouseUp={preventMouseUp}
            >
              <AddCircleIcon className={classes.addIconSvg} />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className={classes.overflowHidden}>
        <div className={classes.background}>
          <div className={classes.backgroundColorTheme}></div>
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.pictureContainer2}>
            {hasPicture ? (
              <img
                src={details.pictureUrl}
                className={classes.profilePicture}
              />
            ) : (
              <AccountCircleIcon
                className={classes.defaultProfileIcon}
              ></AccountCircleIcon>
            )}
          </div>
          <div className={classes.topFiller}></div>
          <Typography
            align="center"
            variant="subtitle1"
            className={classes.nameSection}
          >
            {person.id} {details.name} {details.surname}
          </Typography>{" "}
          <Typography
            align="center"
            variant="subtitle2"
            className={classes.dateSection}
          >
            {displayDate}
          </Typography>
        </div>
      </div>
      <div className={classes.filler} />
      <div className={classes.actions}>
        <Tooltip title="Delete node">
          <IconButton onClick={handleNodeDelete} onMouseUp={preventMouseUp}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <IconButton onClick={handlePartnerAdd} onMouseUp={preventMouseUp}>
          <AddCircleIcon className={classes.addIconSvg} />
        </IconButton>
        <Tooltip title="Add child">
          <IconButton onClick={handleChildAdd} onMouseUp={preventMouseUp}>
            <AddCircleIcon className={classes.addIconSvg} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Sibling">
          <IconButton onClick={handleSiblingAdd} onMouseUp={preventMouseUp}>
            <AddCircleIcon className={classes.addIconSvg} />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  );
};

export default React.memo(PersonNodeCard);
