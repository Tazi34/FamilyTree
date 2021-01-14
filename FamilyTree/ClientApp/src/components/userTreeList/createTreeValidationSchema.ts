import * as Yup from "yup";

export default Yup.object().shape({
  treeName: Yup.string().required("Name is required"),
});
