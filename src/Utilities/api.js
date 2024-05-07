import { customFetch } from "./customerFetch";
export const userLogin = (name, pwd) =>
  customFetch("/users/login", "POST", false, {
    name: name,
    password: pwd,
  });
export const userRegister = (name, pwd) =>
  customFetch("/users/register", "POST", false, {
    name: name,
    password: pwd,
  });
export const searchUser = (userName) =>
  customFetch("/users/search", "GET", false, {
    userName: userName,
  });
export const findID = (userid) =>
  customFetch("/users/find", "GET", false, {
    userID: userid,
  });

export const createChat = (id1, id2) =>
  customFetch("/chat/create", "POST", false, {
    firstID: id1,
    secondID: id2,
  });
export const chatList = (id) =>
  customFetch("/chat/list", "GET", false, {
    userID: id,
  });
export const getMessage = (id) =>
  customFetch("/message/get", "GET", false, {
    chatID: id,
  });

export const sendMessage = (id, sender, text) =>
  customFetch("/message/create", "POST", false, {
    chatID: id,
    senderID: sender,
    text: text,
  });
