import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: 'Неавторизованный: токен не предоставлен' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: 'Неавторизованный: Недействительный токен' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Ошибка в промежуточном программном обеспечении protectRoute', error.message);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}