import axios from "axios";

export const customFetch = async (
  url,
  method,
  auth = false,
  params = "",
  data = null
) => {
  const baseURL = process.env.REACT_APP_END_POINT || "";
  if (auth) {
    const token = JSON.parse(sessionStorage.getItem("token") || "{}");
    const headers = {
      accept: "application/json",
      Authorization: "Bearer " + token,
      "Cache-Control": "no-cache",
    };
    const res = await axios({
      baseURL,
      url,
      method,
      headers,
      params,
      data,
      timeout: 1000 * 90,
    }).catch((error) => {
      sessionStorage.removeItem("token");
      console.log(error);
      switch (error.response.status) {
        case 400:
          break;
        default:
          window.location.href = "/";
          break;
      }
    });
    return res.data;
  } else {
    const headers = {};
    const res = await axios({ baseURL, url, method, headers, params, data });
    console.log(res);
    return res.data;
  }
};
