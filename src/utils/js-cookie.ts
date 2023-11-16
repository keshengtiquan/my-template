import jsCookie from "js-cookie";

export const setCookie = (key: string, value: string, time?: number) => {
  jsCookie.set(key, value, { expires: time ? time : 1 });
};

export const getCookie = (key: string) => {
  return jsCookie.get(key);
};

export const removeCookie = (key: string) => {
  jsCookie.remove(key);
};