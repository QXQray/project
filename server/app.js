import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'; // 1. 引入 cors 套件

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 2. 設定 CORS (必須放在所有 app.use 路由設定的最前面)
app.use(cors({
    origin: [
        'http://localhost:5173',          // 允許你本機開發環境的 Vue 連線 (Vite 預設 port)
        'https://project-three-phi-94.vercel.app/' // 替換成你實際的 Vercel 網址 (注意：結尾不要有斜線 /)
    ],
    credentials: true // 如果你的 API 有用到 cookie 或 session，這個必須設定為 true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 你的路由設定
app.use('/', indexRouter);
app.use('/api/users', usersRouter);

export default app;