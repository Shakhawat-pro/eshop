import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})



let isRefreshing = false;
let refreshSubscriber: (() => void)[] = []

// handle logout and prevent infinite loop
const handleLogout = () => {
    if (window.location.pathname !== "/login") {
        window.location.href = "/login";
    }
}

// handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscriber.push(callback)
}

// execute all the queued requests after getting a new access token
const onRefreshedSuccess = () => {
    refreshSubscriber.forEach((callback) => callback());
    refreshSubscriber = [];
}

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Handle response and refresh token if access token has expired
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        originalRequest._retry = true;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                isRefreshing = false;
                onRefreshedSuccess();
                return axiosInstance(originalRequest);
            } catch (error) {
                isRefreshing = false;
                refreshSubscriber = [];
                handleLogout();
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;