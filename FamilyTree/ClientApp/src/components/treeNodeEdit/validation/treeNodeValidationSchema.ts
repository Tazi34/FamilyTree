import * as Yup from "yup";

export default Yup.object().shape({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  birthday: Yup.string().required("Birthday is required"),
  sex: Yup.string().required("Gender is required"),
});
