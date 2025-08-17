export const getDateRange = (start, end) => {
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current)); // push a clone
    current.setDate(current.getDate() + 1);
  }

  return dates;
};
