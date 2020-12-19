import * as Yup from "yup";

export default Yup.object().shape({
  treeName: Yup.string()
    .min(5, "Name is too short. Minimum 5 letters.")
    .max(50, "Name is too long. Maximum 50 letters.!")
    .required("Name is required"),
});
