import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://todo.api.devcode.gethired.id",
});

const axiosRepository = {
    getActivityGroups: () =>
        axiosInstance.get("/activity-groups", {
            params: { email: "antonyvinz@gmail.com" },
        }),
    postActivityGroups: (payload: any) => axiosInstance.post("/activity-groups", payload),
    deleteActivityGroups: (id: any) => axiosInstance.delete("/activity-groups/" + id),
};

export default axiosRepository;
