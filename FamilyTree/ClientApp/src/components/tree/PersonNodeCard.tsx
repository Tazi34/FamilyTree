import {
  Avatar,
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
  Zoom,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import ChildFriendlyIcon from "@material-ui/icons/ChildFriendly";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FaceIcon from "@material-ui/icons/Face";
import * as React from "react";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { formatDate, formatInitials } from "../../helpers/formatters";
import { areEqualShallow } from "../../helpers/helpers";
import HiddenPersonNode from "./HiddenPersonNode";
import { Node } from "./model/NodeClass";
import { PersonNode } from "./model/PersonNode";
import { ConnectionMode } from "./TreeRenderer";
const imageSize = 57;
const dividerScale = 0.25;
const addIconSize = 25;
const useStyles = makeStyles<any, any>((theme: Theme) => ({
  personRoot: {
    position: "absolute",
    transform: `translate(${-RECT_WIDTH / 2}px,${-RECT_HEIGHT / 2}px)`,
    top: 0,
    left: 0,
    minHeight: RECT_HEIGHT + "px",
    width: RECT_WIDTH + "px",
    borderRadius: 10,
    borderColor: ({ hasUser }) =>
      hasUser ? "white" : theme.palette.primary.light,
    zIndex: 1000,
    borderWidth: 2,
    border: "solid",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",

    background: ({ isConnecting, canConnectTo, hasUser }) => {
      if (isConnecting) {
        return canConnectTo ? theme.palette.primary.light : "#FFCCCB";
      } else {
        return hasUser
          ? theme.palette.primary.light
          : theme.palette.background.paper;
      }
    },
  },
  iconContainer: {
    padding: 4,
  },
  buttonBase: {
    padding: 8,
    background: theme.palette.primary.light,
    display: "flex",
    alignItems: "start",

    width: "100%",
    height: "100%",
  },
  picture: {
    // position: "absolute",
    // top: dividerScale * RECT_HEIGHT - imageSize / 2,
    width: imageSize,
    height: imageSize,
    alignSelf: "center",
    background: "#f4f4f4",
    color: theme.palette.primary.dark,
    border: ({ hasUser }) => {
      return "1px solid " + (hasUser ? "white" : theme.palette.primary.light);
    },
  },

  actionsBar: {
    display: "flex",
    height: 40,
    justifyContent: "flex-end",
  },
  actionsButton: {
    width: 40,
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
  menu: {
    position: "absolute",
    background: "red",
    height: 40,
    width: 50,
    bottom: "100%",
  },
  addIconSvg: {
    fontSize: addIconSize,
    color: ({ hasUser }) => (hasUser ? "#f4f4f4" : theme.palette.primary.light),

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
    justifyContent: "space-around",
    padding: 10,
    marginTop: 50,
  },
  visible: {
    visibility: "visible",
  },
  hidden: {
    visibility: "hidden",
  },
  editButton: {
    alignSelf: "flex-end",
  },
}));

type Props = {
  onNodeDelete: (id: number) => void;
  onNodeMove: (node: Node, x: number, y: number) => void;
  onMoveNodeOnCanvas: (e: DragEvent, node: Node) => void;
  onNodeSelect: (node: PersonNode) => void;
  onConnectStart: (node: PersonNode, mode: ConnectionMode) => void;
  onDisconnectNode: (node: PersonNode) => void;
  onNodeVisiblityChange: (nodeId: number) => void;

  person: PersonNode;
  disabled: boolean;
  canConnectTo?: boolean;
};

const PersonNodeCard = ({
  person,
  onNodeVisiblityChange,
  onNodeDelete,
  onNodeSelect,
  onConnectStart,
  onDisconnectNode,
  canConnectTo,
  disabled,
}: Props) => {
  const elementId = "n" + person.id;
  const [animate, setAnimate] = React.useState(false);

  React.useEffect(() => {
    setAnimate(!animate);
  }, [person.hidden]);
  const classes = useStyles({
    isConnecting: disabled,
    canConnectTo,
    hasUser: person.userId !== 0,
  });
  const handleNodeDelete = () => {
    onNodeDelete(person.id as number);
  };

  const handleNodeSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    onNodeSelect(person);
  };
  const handleStartConnect = (mode: ConnectionMode) => {
    onConnectStart(person, mode);
  };
  const handleNodeVisibilityChange = () => {
    onNodeVisiblityChange(person.id as number);
  };
  const details = person.personDetails;

  let displayDate = formatDate(details.birthday);

  const preventMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const initials = formatInitials(details.name, details.surname);
  const hidden = person.hidden;

  const canEdit = person.canEdit;
  return (
    <div>
      <HiddenPersonNode
        picture={details.pictureUrl}
        initials={initials}
        hidden={!hidden}
        onClick={handleNodeVisibilityChange}
      />

      <Zoom timeout={1000} in={!hidden} style={{ transitionDelay: "100ms" }}>
        <div>
          <Paper
            id={elementId}
            component={"span"}
            className={`${classes.personRoot}`}
            onMouseUp={handleNodeSelect}
          >
            <div className={classes.overflowHidden}>
              <div className={classes.background}>
                <div className={classes.backgroundColorTheme}></div>
              </div>
              <div className={classes.contentContainer}>
                <div className={classes.actionsBar}>
                  {canEdit && (
                    <IconButton
                      className={`${classes.actionButton} ${classes.editButton}`}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </div>

                <Avatar
                  title={details.name}
                  src={details.pictureUrl}
                  className={classes.picture}
                  alt={initials}
                ></Avatar>

                <Typography
                  align="center"
                  variant="subtitle1"
                  className={classes.nameSection}
                >
                  {details.name} {details.surname}
                </Typography>
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
            {canEdit && (
              <div className={classes.actions}>
                <Tooltip title="Connect as child">
                  <IconButton
                    style={{ padding: 4 }}
                    className={classes.actionContainer}
                    disabled={disabled}
                    onClick={() => handleStartConnect("AsChild")}
                    onMouseUp={preventMouseUp}
                  >
                    <ChildFriendlyIcon className={classes.addIconSvg} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Connect as partner">
                  <IconButton
                    style={{ padding: 4 }}
                    className={classes.actionContainer}
                    disabled={disabled}
                    onClick={() => handleStartConnect("AsPartner")}
                    onMouseUp={preventMouseUp}
                  >
                    <i className={classes.addIconSvg + " fas fa-heart"}></i>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Connect as parent">
                  <IconButton
                    style={{ padding: 4 }}
                    className={classes.actionContainer}
                    disabled={disabled}
                    onClick={() => handleStartConnect("AsParent")}
                    onMouseUp={preventMouseUp}
                  >
                    <FaceIcon className={classes.addIconSvg} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Remove links">
                  <IconButton
                    style={{ padding: 4 }}
                    className={classes.actionContainer}
                    disabled={disabled}
                    onClick={() => onDisconnectNode(person)}
                    onMouseUp={preventMouseUp}
                  >
                    <i className={classes.addIconSvg + " fas fa-unlink"}></i>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete node">
                  <IconButton
                    style={{ padding: 4 }}
                    className={classes.actionContainer}
                    disabled={disabled}
                    onClick={handleNodeDelete}
                    onMouseUp={preventMouseUp}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </Paper>
        </div>
      </Zoom>
    </div>
  );
};
const areEqual = (prev: Props, next: Props) => {
  if (
    prev.disabled != next.disabled ||
    prev.canConnectTo != next.canConnectTo ||
    prev.person.id != next.person.id ||
    prev.person.motherId != next.person.motherId ||
    prev.person.fatherId != next.person.fatherId ||
    prev.person.canEdit != next.person.canEdit ||
    prev.person.x != next.person.x ||
    prev.person.y != next.person.y ||
    prev.person.hidden != next.person.hidden ||
    !areEqualShallow(prev.person.personDetails, next.person.personDetails)
  ) {
    console.log("NOT EQUAL");
    return false;
  }

  return true;
};
const visibleStyle: any = {}; //{ visibility: "visible" };
const hiddenStyle: any = {}; //{ visibility: "hidden" };
export default React.memo(PersonNodeCard, areEqual);
