import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import SwipeableViews from "react-swipeable-views";
import { useThunkDispatch } from "../..";
import {
  CREATE_POST_FORM_PAGE_URI,
  HOME_PAGE_URI,
} from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import { StatusState } from "../../helpers/helpers";
import { BlogProfile } from "../../model/BlogProfile";
import { Post } from "../../model/Post";
import useAlert from "../alerts/useAlert";
import { tryOpenChat } from "../chat/chatReducer";
import { getUser, User } from "../loginPage/authenticationReducer";
import ResponsiveMainColumn from "../mainColumn/ResponsiveMainColumn";
import PostsList from "../posts/PostsList";
import UserProfileDialog from "../userProfile/UserProfileDialog";
import TreesListProvider from "../userTreeList/TreesListProvider";
import BlogOwnerSection from "./BlogOwnerSection";
import BlogProfileSection from "./BlogProfileSection";
import { deletePost, getBlog, postsSelectors } from "./redux/postsReducer";

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    width: "100%",
    height: "100%",
  },
  backPictureSection: {
    width: "100%",
  },
  backPicture: {
    width: "100%",
    height: "100%",
  },
  profileSection: {},
  selectionBar: {},
  contentSection: {
    minHeight: "100%",
    background: theme.palette.background.paper,
    padding: 20,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  treesContainer: {
    padding: 10,
  },
  cardsBackground: {
    background: theme.palette.background.paper,
  },
  topPart: {},
}));

const BlogPage = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const blogId = props.computedMatch.params.blogId;
  const history = useHistory();
  const alert = useAlert();
  const [editProfileDialog, setEditProfileDialog] = React.useState(false);
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
  }, [blogId]);

  const redirectToPostForm = () => {
    history.push(CREATE_POST_FORM_PAGE_URI);
  };
  const openEditProfileDialog = () => {
    setEditProfileDialog(true);
  };
  const closeEditProfileDialog = () => {
    setEditProfileDialog(false);
  };

  const handlePostDelete = (id: number) => {
    dispatch(deletePost(id)).then((response: any) => {
      if (!response.error) {
        alert.success("Post deleted");
      } else {
        alert.error("Couldn't delete post. Try again later");
      }
    });
  };
  const handleContact = () => {
    dispatch(tryOpenChat({ chatId: blogId, doOpen: true }));
  };
  if (!blogId) {
    return <Redirect to={HOME_PAGE_URI} />;
  }

  const isUserOwnerOfBlog = Boolean(profile && profile.userId === user?.id);
  const isLoading = fetchStatus.loading || !profile;
  return (
    <div className={classes.main}>
      <ResponsiveMainColumn>
        <div className={classes.contentSection}>
          <div className={classes.topPart}>
            {isUserOwnerOfBlog ? (
              <BlogOwnerSection
                user={user as User}
                onEditProfile={openEditProfileDialog}
                redirectToPostForm={redirectToPostForm}
              ></BlogOwnerSection>
            ) : (
              <BlogProfileSection onContact={handleContact} profile={profile} />
            )}
          </div>

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
          <div>
            <SwipeableViews
              index={selectedTab}
              onChangeIndex={(value: any) => {
                setSelectedTab(value);
              }}
              slideStyle={{
                overflowY: "hidden",
              }}
            >
              <div style={selectedTab === 0 ? {} : { height: 1 }}>
                <PostsList
                  isOwner={isUserOwnerOfBlog}
                  loaded={!isLoading}
                  posts={posts}
                  onPostDelete={handlePostDelete}
                />
              </div>

              <div
                className={classes.treesContainer}
                style={selectedTab === 1 ? {} : { height: 1 }}
              >
                <TreesListProvider
                  loaded={!isLoading}
                  isOwner={isUserOwnerOfBlog}
                  userId={blogId}
                />
                <div style={{ flexGrow: 1 }} />
              </div>
            </SwipeableViews>
          </div>
        </div>
      </ResponsiveMainColumn>
      {user && (
        <UserProfileDialog
          open={editProfileDialog}
          onClose={closeEditProfileDialog}
        />
      )}
    </div>
  );
};

export default BlogPage;
