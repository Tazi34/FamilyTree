import { format } from "date-fns";

export const formatDate = (date: string): string => {
  if (!date) {
    return "";
  }
  try {
    return format(new Date(date), "d MMM yyyy");
  } catch {
    return date;
  }
};
