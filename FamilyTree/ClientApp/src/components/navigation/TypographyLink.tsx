import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link as RouterLink } from "react-router-dom";
import * as React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

type Props = {
  children: React.ReactNode;
  to: string;
} & any;
export function TypographyLink({ children, to, ...props }: Props) {
  return (
    <Link component={RouterLink} to={to}>
      <Typography {...props}>{children}</Typography>
    </Link>
  );
}
