const general_request = {
  BASE_URL: import.meta.env.VITE_HOST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("authToken"),
  },
};

export default general_request;
