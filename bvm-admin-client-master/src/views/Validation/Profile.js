import * as Yup from "yup";


export const initialValues = {
  _id: "",
  username: "",
  userEmailId: "",
  phone: "",
  country: "",
  city: "",
  state: "",
  photo: "",
  gender: ""
};

 export const validationSchema = function (values) {
  return Yup.object().shape({
    username: Yup.string()
      .min(3, `username has to be at least 3 characters`)
      .required("username is required"),
    userEmailId: Yup.string()
      .email("Invalid email address")
      .required("Email is required!"),
    phone: Yup.string().required("Phone is Required"),
    gender: Yup.string().required("gender is required"),
    country: Yup.string().required("country is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
  });
};

export const validate = getValidationSchema => {
  return values => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, {abortEarly: false});
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};

export const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR]
    };
  }, {});
};

export const findFirstError = function(formName, hasError) {
  const form = document.forms[formName];
  for (let i = 0; i < form.length; i++) {
    if (hasError(form[i].name)) {
      form[i].focus();
      break;
    }
  }
}

export const validateForm = function(errors) {
  findFirstError("simpleForm", fieldName => {
    return Boolean(errors[fieldName]);
  });
}

export const touchAll = function(setTouched, errors) {
  setTouched({
    firstName: true,
    lastName: true,
    email: true,
    designation: true,
    qualification: true,
    dateOfBirth: true
  });
  validateForm(errors);
}
