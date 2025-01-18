import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		await Notification.updateMany({ to: userId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Ошибка в функции getNotifications", error.message);
		res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
};

export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Уведомления успешно удалены" });
	} catch (error) {
		console.log("Ошибка в функции deleteNotifications", error.message);
		res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
};