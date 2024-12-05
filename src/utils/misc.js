export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...`;
}
