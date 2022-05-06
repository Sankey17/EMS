import * as Yup from "yup";


export const initialValues = {
  from:"",
  to:"",
  reason:"",
  date:"",
  otherReason:"",
  leaveFfDay:'',
  leaveTypeDay:""
};

export const validationSchema = function (values) {
  return Yup.object().shape({
    // name: Yup.string()
    //   .min(3, `name has to be at least 3 characters`)
    //   .required("name is required"),
    // department: Yup.string()
    //   .min(1, `department name has to be at least 1 character`)
    //   .required("department name is required"),
    from: Yup.string().required("Date of from is required"),
    to: Yup.string().required("Date of to is required"),
    date: Yup.string().required("Date is required"),
    reason: Yup.string().required("reason must be  is required"),
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
    name: true,
    department:true,
    from:true,
    to:true,
    reason:true
  });
  validateForm(errors);
}
