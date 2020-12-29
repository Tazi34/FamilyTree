import {
  ButtonBase,
  CardActionArea,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { default as DeleteIcon } from "@material-ui/icons/HighlightOff";
import { D3DragEvent } from "d3";
import { format } from "date-fns";
import * as React from "react";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import { Node } from "./model/NodeClass";
import { PersonNode } from "./model/PersonNode";
import { Point } from "./Point";
const d3 = require("d3");
const imageSize = 57;
const dividerScale = 0.25;
const addIconSize = 30;
const useStyles = makeStyles((theme: Theme) => ({
  personRoot: (node: Point) => ({
    position: "absolute",
    transform: `translate(${node.x - RECT_WIDTH / 2}px,${
      node.y - RECT_HEIGHT / 2
    }px)`,
    top: 0,
    left: 0,
    height: RECT_HEIGHT + "px",
    width: RECT_WIDTH + "px",
    borderRadius: 10,
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    border: "solid",

    cursor: "pointer",
  }),
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
    background: theme.palette.primary.light,
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
}));

type Props = {
  person: PersonNode;
  x: number;
  y: number;
  onNodeDelete: (id: number) => void;
  onParentAdd: (id: number, data: CreateNodeRequestData) => void;
  onNodeMove: (node: Node, x: number, y: number) => void;
  onMoveNodeOnCanvas: (e: DragEvent, node: Node) => void;
  onNodeSelect: (node: PersonNode) => void;
};

const PersonNodeCard = ({
  person,
  onParentAdd,
  onNodeDelete,
  onNodeMove,
  onMoveNodeOnCanvas,
  onNodeSelect,
}: Props) => {
  const addButtonRef = React.useRef(null);
  const elementId = "n" + person.id;
  const classes = useStyles({ x: person.x, y: person.y });
  const handleParentAdd = () => {
    console.log("EVENT");
    const newPerson: CreateNodeRequestData = {
      treeId: person.treeId,
      name: "New",
      surname: "Node",
      birthday: "2020-12-17T07:5:08.998Z",
      description: "Cool description",
      pictureUrl: "",
      userId: 0,
      fatherId: 0,
      sex: "Male",
      motherId: 0,
      children: [],
      partners: [],
    };
    onParentAdd(person.id as number, newPerson);
  };
  React.useEffect(() => {
    var dragHandler = d3
      .drag()
      .subject((e: any, d: any) => {
        return {
          x: person.x,
          y: person.y,
        };
      })
      .on("start", (e: any) => {})
      .on("drag", (e: any, d: any) => {
        onMoveNodeOnCanvas(e, person);
      })
      .on("end", (e: D3DragEvent<any, any, PersonNode>, node: PersonNode) => {
        if (e.x === person.x && e.y === person.y) {
          onNodeSelect(person);
        } else {
          onNodeMove(person, e.x, e.y);
        }
      });
    const addButton = d3.select("#" + "add-parent-button");
    addButton.on("click", () => console.log("XDD"));

    const element = d3.select("#" + elementId);
    element.on("click", (e: any) => {
      console.log(e);
      if (e.path.some((el: any) => el.id === "add-parent-button")) {
        handleParentAdd();
      } else {
        onNodeSelect(person);
      }
    });
    dragHandler(element);

    d3.selectAll(".not-draggable").on("mousedown", function (e: any) {
      e.stopPropagation();
    });
  }, []);
  const handleNodeDelete = () => {
    onNodeDelete(person.id as number);
  };
  const details = Object.assign({}, person.personDetails);
  details.pictureUrl = `https://eu.ui-avatars.com/api/?name=${details.name}+${details.surname}`;
  const hasPicture = Boolean(details.pictureUrl);
  const displayDate = format(new Date(details.birthday), "d MMM yyyy");
  return (
    <Paper
      id={elementId}
      component={"span"}
      className={`${classes.personRoot}`}
    >
      <div className={classes.addButtonContainer}>
        <IconButton
          id="add-parent-button"
          className={`${classes.addIcon} not-draggable`}
          onClick={handleParentAdd}
        >
          <AddCircleIcon className={classes.addIconSvg} />
        </IconButton>
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
            {details.name} {details.surname}
          </Typography>{" "}
          <Typography
            align="center"
            variant="subtitle2"
            className={classes.dateSection}
          >
            {displayDate}
          </Typography>
        </div>
        {/* <CardActionArea className={classes.buttonBase}>
        <div className={classes.pictureContainer}>
          {hasPicture ? (
            <img
              src={person.personDetails.pictureUrl}
              className={classes.profilePicture}
            />
          ) : (
            <AccountCircleIcon
              className={classes.defaultProfileIcon}
            ></AccountCircleIcon>
          )}
        </div>

        <Typography>
          {person.id} {details.name} {details.surname}
        </Typography>
        <div className={classes.filler} />
        <div className={classes.actionsContainer}>
          <IconButton
            className={`${classes.deleteIcon} not-draggable`}
            onClick={handleNodeDelete}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            className={`${classes.deleteIcon} not-draggable`}
            onClick={handleParentAdd}
          >
            <AddCircleIcon />
          </IconButton>
        </div>
      </CardActionArea> */}
      </div>
    </Paper>
  );
};

export default PersonNodeCard;
