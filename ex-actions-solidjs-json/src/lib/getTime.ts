import { isServer } from "solid-js/web";

export function getTime(name: string) {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const milliseconds = String(d.getMilliseconds()).padStart(3, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  const server = isServer ? "Server" : "Client"
  return `${name} | ${server} | ${formattedTime} `
}
