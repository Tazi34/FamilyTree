import { format } from "date-fns";

export const formatDate = (date?: string): string => {
  if (!date) {
    return "";
  }
  try {
    return format(new Date(date), "d MMM yyyy");
  } catch {
    return date;
  }
};

export const formatInitials = (name: string, surname: string): string => {
  var initials = "";
  if (name && name.length > 0) {
    initials += name[0];
  }
  if (surname && surname.length > 0) {
    initials += surname[0];
  }
  return initials.toUpperCase();
};
