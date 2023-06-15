import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer'; 
import cors from 'cors';

import { UserController, PostController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';


const app = express();

/* Подключение хранилища */
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

/* Подключение доп объектов */
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

/* Подключение к MongoDB */
mongoose.connect(
    'mongodb+srv://admin:123456RR@cluster0.17nqzzy.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB ko'))
.catch((err) => console.log('DB error', err));

/* Сайт */
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

/* Сервер */
app.listen(4444, (err) => {                // функцию указать обязательно, например вот такая
    if (err) {
        return console.log(err);
    }

    console.log('Server Ok');
});