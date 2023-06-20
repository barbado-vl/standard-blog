import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум из 5 символов').isLength({ min: 5}),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум из 5 символов').isLength({ min: 5}),
    body('fullName', 'Укажите имя').isLength({ min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Размер статьи должен быть больше 100 символов').isLength({ min: 100 }).isString(),
    body('tags', 'Неверный форммат тегов(укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export const commentCreateValidation = [
    body('text', 'Введите текст комментария').isLength({ min: 3 }).isString(),
    body('postId', 'Неверный postId').isLength({ min: 6 }).isString(),
];