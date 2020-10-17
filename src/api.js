import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_API,
    headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json",
    },
});

export default http;