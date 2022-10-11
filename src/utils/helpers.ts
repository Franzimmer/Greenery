export function unixTimeToString(unixTime: number) {
  const date = new Date(unixTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formatedDate = `${year}-${month}-${day}`;
  return formatedDate;
}

export function disableWindowScrolling() {
  document.body.style.overflow = "hidden";
}
export function enableWindowScrolling() {
  document.body.style.overflow = "initial";
}
