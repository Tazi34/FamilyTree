import axios from "axios";
import { GEDCOME_API_URL } from "./../../../../helpers/apiHelpers";

export const EXPORT_TREE_API_URL = `${GEDCOME_API_URL}`;

export type ExportTreeRequestData = {
  treeId: number;
};

export type ExportTreeResponse = any;

export const requestExportTree = (data: ExportTreeRequestData) => {
  return axios
    .get<ExportTreeResponse>(`${EXPORT_TREE_API_URL}/${data.treeId}`)
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tree.ged"); //or any other extension
      document.body.appendChild(link);
      link.click();
      return response;
    });
};
