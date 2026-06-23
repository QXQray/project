import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
//const dbPath = path.join(__dirname, 'db', 'sqlite.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('無法連線到資料庫:', err.message);
  } else {
    console.log('已成功連線到 SQLite 資料庫:', dbPath);
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // ✅ 修改：將原本單一點座標改為 x1, y1 (左上) 與 x2, y2 (右下)
    db.run(`CREATE TABLE IF NOT EXISTS Locations (
      location_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      x1 REAL NOT NULL,
      y1 REAL NOT NULL,
      x2 REAL NOT NULL,
      y2 REAL NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('Admin', 'Student')) NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Lost_Items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER,
      item_name TEXT NOT NULL,
      description TEXT NOT NULL,
      photo_path TEXT,
      status TEXT CHECK(status IN ('保存中', '已認領', '已銷毀')) DEFAULT '保存中',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES Locations(location_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Posts (
      post_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
    )`);

    seedData();
  });
}

function seedData() {
  db.get("SELECT COUNT(*) AS count FROM Locations", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Locations (name, x1, y1, x2, y2) VALUES (?, ?, ?, ?, ?)");
      // ✅ 依據您提供的紅框，重新計算的區塊座標 (x1, y1, x2, y2)
      const locations = [
        ["學思樓", 6.0, 5.5, 16.0, 18.0],
        ["學思園", 20.0, 6.0, 33.0, 16.0],
        ["文華創意中心", 2.5, 5.0, 5.5, 26.0],
        ["體育館", 36.5, 6.0, 54.0, 17.0],
        ["游泳池", 56.0, 11.5, 63.5, 16.2],
        ["iHub", 58.2, 6.0, 66.2, 10.0],
        ["土木水利館", 6.0, 21.5, 17.0, 31.0],
        ["理學大樓", 20.0, 20.0, 33.5, 31.0],
        ["綜合運動場", 35.5, 19.5, 67.3, 39.0],
        ["育樂館", 6.5, 33.7, 15.5, 50.0],
        ["運動場看台", 43.2, 41.0, 59.0, 44.8],
        ["網球場", 35.5, 44.8, 44.5, 51.5],
        ["籃球場", 44.6, 44.8, 60.5, 51.5],
        ["排球場", 60.6, 44.8, 67.3, 51.5],
        ["語文大樓", 7.0, 53.5, 18.0, 59.0],
        ["第一招待所", 23.0, 53.0, 34.5, 59.0],
        ["人言大樓", 35.7, 54.0, 46.0, 60.0],
        ["人社館", 47.8, 53.6, 56.5, 58.5],
        ["電通館", 57.3, 53.6, 65.9, 58.5],
        ["建築館", 6.7, 59.0, 9.0, 65.0],
        ["忠勤樓", 6.7, 65.0, 17.3, 73.0],
        ["工學館", 20.7, 61.0, 34.0, 72.5],
        ["資訊電機館", 48.0, 64.0, 66.0, 73.0],
        ["行政大樓", 6.7, 81.0, 18.3, 87.5],
        ["行政二館", 20.2, 81.5, 27.0, 92.5],
        ["丘逢甲紀念館", 28.5, 88.8, 40.0, 94.2],
        ["圖書館", 40.0, 77.0, 51.0, 89.0],
        ["科學與航太館", 43.0, 89.3, 54.0, 94.5],
        ["商學大樓", 54.0, 87.9, 66.5, 94.8],
        ["春雨塘", 54.0, 76.0, 66.0, 86.0],
        ["共善樓", 68.0, 46.0, 96.0, 80.0],
        ["汽車停車場", 72.5, 4.0, 84.5, 15.0],
        ["機車停車場", 68.8, 4.0, 72.0, 18.0],
        ["汽車停車場(南)", 6.5, 88.0, 18.0, 93.5],
        ["機車停車場(南)", 16.0, 94.3, 27.5, 97.0],
        ["自行車停車場", 28.7, 94.3, 40.0, 97.0],
        ["汽車停車場(文華路)", 3.3, 34.0, 5.0, 73.5],
        ["噴水池", 7.0, 75.0, 9.5, 81.0],
        ["榕榕大道", 10.0, 75.0, 18.5, 81.0]
      ];
      locations.forEach(loc => stmt.run(loc));
      stmt.finalize();
    }
  });

  // 2. 新增擴充版的 Users
  db.get("SELECT COUNT(*) AS count FROM Users", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)");
      const users = [
        ["admin", "admin", "Admin"],
        ["D1358010", "123456", "Student"],
        ["D1262814", "123456", "Student"]
      ];
      users.forEach(user => stmt.run(user));
      stmt.finalize();
      console.log("Users 資料新增完成");
    }
  });

  db.get("SELECT COUNT(*) AS count FROM Lost_Items", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Lost_Items (location_id, item_name, description, photo_path, status, created_at) VALUES (?, ?, ?, ?, ?, ?)");
      const items = [
        [22, "Sony 藍芽耳機", "黑色，右耳有小刮痕", "uploads/earphone.jpg", "保存中", "2026-06-18 10:15:00"],
        [28, "透明水壺", "蓋子是藍色的", "uploads/bottle.jpg", "已認領", "2026-06-17 14:30:00"],
        [24, "DE0 FPGA 開發板", "上課用的DE0開發板，背面有貼姓名貼紙", null, "保存中", "2026-06-20 09:00:00"],
        [1, "Java 物件導向課本", "內頁有很多螢光筆筆記跟書籤", null, "已銷毀", "2025-12-10 16:45:00"],
        [8, "貓咪造型隨身碟", "容量 64GB，裡面可能有 OpenCV 作業檔案，很急！", null, "保存中", "2026-06-21 11:20:00"],
        [4, "Cisco 網路線與轉接頭", "一條藍色的 Console 轉接線", null, "已認領", "2026-05-05 13:10:00"],
        [16, "多元智慧眼鏡企劃書", "幾張釘在一起的A4紙，邊角有點折到", null, "保存中", "2026-06-22 08:30:00"],
        [23, "黑色長夾", "裡面有學生證跟一些零錢", null, "保存中", "2026-06-21 18:00:00"],
        [37, "Porsche 911 turbo s", "銀灰色、黃色卡鉗", "uploads/1782223373371", "保存中", "2026-06-24 01:34:27"]
      ];
      items.forEach(item => stmt.run(item));
      stmt.finalize();
      console.log("Lost_Items 資料新增完成");
    }
  });

  // 4. 新增 Posts 的預設資料
  db.get("SELECT COUNT(*) AS count FROM Posts", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)");
      const posts = [
        [2, "協助尋獲", "我的多元智慧眼鏡企劃書不見了，請問有人在語文大樓附近看到嗎？"],
        [3, "協助尋獲", "急！弄丟了上課用的 DE0 開發板，拜託有看到的同學聯絡我！"],
        [2, "純討論", "有人推薦哪裡可以買到好用的 Cisco 設備嗎？想自己練習 Packet Tracer 以外的實機操作。"],
        [1, "純討論", "【系統公告】請大家發文時注意禮貌，並多加利用系統的協尋功能。"]
      ];
      posts.forEach(post => stmt.run(post));
      stmt.finalize();
      console.log("Posts 資料新增完成");
    }
  });
}

export default db;