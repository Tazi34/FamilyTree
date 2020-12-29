import {
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { TabPanel } from "@material-ui/lab";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import SwipeableViews from "react-swipeable-views";
import { useThunkDispatch } from "../..";
import {
  CREATE_POST_FORM_PAGE_URI,
  HOME_PAGE_URI,
  PROFILE_PAGE_URI,
} from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import { StatusState } from "../../helpers/helpers";
import { BlogProfile } from "../../model/BlogProfile";
import { Post } from "../../model/Post";
import { withAlertMessage } from "../alerts/withAlert";
import { tryOpenChat } from "../chat/chatReducer";
import { getUser } from "../loginPage/authenticationReducer";
import TreesListProvider from "../userTreeList/TreesListProvider";
import UserTreePanel from "../userTreeList/UserTreePanel";
import BlogOwnerSection from "./BlogOwnerSection";
import BlogProfileSection from "./BlogProfileSection";
import PostsList from "./PostsList";
import { deletePost, getBlog, postsSelectors } from "./redux/postsReducer";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  main: {
    width: "90vh",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  backPictureSection: {
    width: "100%",
    height: 300,
  },
  backPicture: {
    width: "100%",
    height: "100%",
  },
  profileSection: {},
  selectionBar: {},
  contentSection: {},
  treesContainer: {
    padding: 10,
  },
}));
interface ParamTypes {
  blogId: string | undefined;
}
const BlogPage = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const blogId = props.computedMatch.params.blogId;
  const history = useHistory();

  const [selectedTab, setSelectedTab] = React.useState(0);
  const user = useSelector(getUser);
  const fetchStatus = useSelector<ApplicationState, StatusState>((state) => {
    return state.posts.status;
  });
  const posts = useSelector<ApplicationState, Post[]>((state) => {
    return postsSelectors.selectAll(state);
  });
  const profile = useSelector<ApplicationState, BlogProfile | null>((state) => {
    return state.posts.profile;
  });

  useEffect(() => {
    dispatch(getBlog(parseFloat(blogId)));
  }, []);

  const redirectToPostForm = () => {
    history.push(CREATE_POST_FORM_PAGE_URI);
  };
  const redirectToProfileEdit = () => {
    history.push(PROFILE_PAGE_URI);
  };

  const handlePostDelete = (id: number) => {
    dispatch(deletePost(id)).then((response: any) => {
      if (!response.error) {
        props.alertSuccess("Post deleted");
      } else {
        props.alertError("Couldn't delete post. Try again later");
      }
    });
  };
  const handleContact = () => {
    dispatch(tryOpenChat(blogId));
  };

  if (!blogId) {
    return <Redirect to={HOME_PAGE_URI} />;
  }
  if (fetchStatus.loading || !profile) {
    return <CircularProgress />;
  }

  const isUserOwnerOfBlog = profile.userId === user?.id;
  return (
    <Grid container className={classes.root}>
      <Paper className={classes.main}>
        <div className={classes.backPictureSection}>
          <img
            className={classes.backPicture}
            src="https://picsum.photos/800/300"
          />
        </div>

        {isUserOwnerOfBlog ? (
          <BlogOwnerSection
            onEditProfile={redirectToProfileEdit}
            redirectToPostForm={redirectToPostForm}
          ></BlogOwnerSection>
        ) : (
          <BlogProfileSection onContact={handleContact} profile={profile} />
        )}
        <div className={classes.selectionBar}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
            value={selectedTab}
            onChange={(e: any, value: any) => {
              setSelectedTab(value);
            }}
          >
            <Tab value={0} label="Posts" />
            <Tab value={1} label="Trees" />
          </Tabs>
        </div>
        <div className={classes.contentSection}>
          <SwipeableViews
            index={selectedTab}
            onChangeIndex={(value: any) => {
              setSelectedTab(value);
            }}
            slideStyle={{
              overflowY: "hidden",
            }}
          >
            <div>
              {!Boolean(posts) ? (
                <CircularProgress />
              ) : (
                <PostsList
                  posts={[...posts, ...posts, ...posts]}
                  onPostDelete={handlePostDelete}
                />
              )}
            </div>
            <div className={classes.treesContainer}>
              <TreesListProvider userId={blogId} />
            </div>
          </SwipeableViews>
        </div>
      </Paper>
    </Grid>
  );
};

export default withAlertMessage(BlogPage);
