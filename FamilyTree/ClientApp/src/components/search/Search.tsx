import { Box, InputBase, makeStyles } from "@material-ui/core";
import { fade, Theme } from "@material-ui/core/styles";
import * as React from "react";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    borderWidth: 2,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },

    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 300,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

type Props = {
  // onChange: (query: string) => void;
  query: string;
  onChange: (a: any) => void;
};

const ENTER_KEY = 13;
const WAIT_INTERVAL = 1000;

const Search = ({ query, onChange }: Props) => {
  const classes = useStyles();
  const timerRef = React.useRef<any>(undefined);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //   }
  //   const newValue = e.target.value;
  //   if (Boolean(newValue)) {
  //     timerRef.current = setTimeout(() => onSearch(newValue), WAIT_INTERVAL);
  //   }
  //   setQuery(newValue);
  // };

  return (
    <Box border={1} borderColor="primary.main" className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        value={query}
        placeholder="Search…"
        onChange={onChange}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </Box>
  );
};

export default Search;
