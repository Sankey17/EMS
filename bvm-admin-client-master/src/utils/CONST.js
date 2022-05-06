export const setDateFormat = (date) => {
  let dd = date.getDate();
  let mm = date.getMonth() + 1; //January is 0!
  const yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return mm + "-" + dd + "-" + yyyy;
};

export const ToastTimeout = 3000;
export const REPORT_PAGE_LIMIT = 2;
