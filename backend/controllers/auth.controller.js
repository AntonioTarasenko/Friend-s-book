import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrpyt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Неверный формат электронной почты' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Имя пользователя уже занято' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email уже занят' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Пароль должен быть длиной не менее 6 символов' });
    }
    // hash password
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: 'Неверные данные пользователя' });
    }
  } catch (error) {
    console.log('Ошибка в контроллере регистрации', error.message);

    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrpyt.compare(
      password,
      user?.password || ''
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log('Ошибка в контроллере входа', error.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Успешно вышел(а) из системы' });
  } catch (error) {
    console.log('Ошибка в контроллере выхода из системы', error.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

export const getMe = async (req, res) => {

  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log('Ошибка в контроллере getMe', error.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}