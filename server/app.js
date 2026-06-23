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

// 1. 讓 Express 知道要去哪裡找 Vue 打包後的靜態檔案 (dist 資料夾)
app.use(express.static(path.join(__dirname, '../client/dist')));

// 2. 捕捉所有其他的網址請求，統統回傳 Vue 的 index.html，交給 Vue Router 處理前端路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

export default app;