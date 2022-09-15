export function unixTimeToString(unixTime: number) {
  let date = new Date(unixTime);
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  const formatedDate = `${year}-${month}-${day}`;
  return formatedDate;
}
