import axios from "axios";

const instance = axios.create({
    // baseURL: "http://localhost:8080",
    baseURL:"https://ecomm-backend-pjcq.onrender.com",
});

export default instance;
