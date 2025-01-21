import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaPoop } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Что-то пошло не так");
            return data;
        },
    });

    const notifications = data?.notifications || []; // Убедимся, что данные есть


    // Mutation to delete notifications
    const { mutate: deleteNotifications } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/notifications", {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Что-то пошло не так");
            return data;
        },
        onSuccess: () => {
            toast.success("Уведомления успешно удалены");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <p className="font-bold">Уведомления</p>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="m-1">
                        <IoSettingsOutline className="w-4" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <a onClick={deleteNotifications}>Удалить все уведомления</a>
                        </li>
                    </ul>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center h-full items-center">
                    <LoadingSpinner size="lg" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center p-4 font-bold">Нет уведомлений 🤔</div>
            ) : (
                notifications.map((notification) => (
                    <div className="border-b border-gray-700" key={notification._id}>
                        <div className="flex gap-2 p-4">
                            {notification.type === "follow" && <FaUser className="w-7 h-7 text-primary" />}
                            {notification.type === "like" && <FaHeart className="w-7 h-7 text-red-500" />}
                            {notification.type === "hate" && <FaPoop className="w-7 h-7 text-amber-900" />}
                            <Link to={`/profile/${notification.from.username}`}>
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <img src={notification.from.profileImg || "/avatar-placeholder.png"} />
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <span className="font-bold">@{notification.from.username}</span>{" "}
                                    {notification.type === "follow" && "последовал за тобой"}
                                    {notification.type === "like" && "понравился ваш пост"}
                                    {notification.type === "hate" && "ненавидит твой пост"}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationPage;
