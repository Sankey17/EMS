import * as Yup from "yup";


export const initialValues = {
  firstName: "",
  employeeCode:"",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  streetAddress: "",
  city: "",
  state: "",
  pincode: "",
  length: '',
  dateOfJoin: "",
  designation: "",
  qualification: "",
  gender: '',
  emailId:"",
};

export const validationSchema = function (values) {
  return Yup.object().shape({
    firstName: Yup.string()
      .min(3, `First name has to be at least 3 characters`)
      .required("First name is required"),
    lastName: Yup.string()
      .min(1, `Last name has to be at least 1 character`)
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required!"),
    phone: Yup.string().required("Phone is Required"),
    designation: Yup.string().required("Designation is required"),
    qualification: Yup.string().required("Qualification is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    dateOfJoin: Yup.string().required("Date of birth is required"),
    streetAddress: Yup.string().required("Streed Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required")
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
