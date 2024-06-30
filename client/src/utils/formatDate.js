function formatDate(date) {
  return new Intl.DateTimeFormat().format(new Date());
}

export default formatDate;
