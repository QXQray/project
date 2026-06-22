import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db', 'sqlite.db');

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
        ["學思樓", 5, 5, 16.5, 17], ["學思園", 20, 6, 33, 16], ["文華創意中心", 2.5, 5, 5.5, 26],
        ["體育館", 36, 5, 54.5, 16], ["游泳池", 55, 10, 63, 16], ["iHub", 58, 5, 66, 9.5],
        ["土木水利館", 6, 21, 17, 31], ["理學大樓", 20, 20, 33.5, 31], ["綜合運動場", 37, 20, 64, 37],
        ["育樂館", 6, 33, 15, 49], ["草坪", 18.5, 33, 33.5, 49], ["運動場看台", 43, 40, 54, 44],
        ["網球場", 38, 45, 44, 50], ["籃球場", 46, 45, 56, 50], ["排球場", 57, 45, 62, 50],
        ["語文大樓", 6, 52, 14, 58], ["第一招待所", 22.5, 51, 33.5, 57], ["人言大樓", 35.5, 53, 43.5, 59],
        ["人社館", 45, 53, 52.5, 58], ["電通館", 53.5, 53, 60.5, 58], ["建築館", 6.5, 59, 9, 64.5],
        ["忠勤樓", 6, 65, 14, 73], ["工學館", 19.5, 60, 34, 72.5], ["資訊電機館", 46, 62, 65, 72],
        ["行政大樓", 6, 81, 16, 87], ["行政二館", 18, 81, 24.5, 91], ["丘逢甲紀念館", 26, 88, 35, 94],
        ["圖書館", 38, 76, 48, 88.5], ["科學與航太館", 41, 89, 52, 95], ["商學大樓", 53, 88, 65, 95],
        ["春雨塘", 52, 76, 65, 85], ["共善樓", 68, 46, 96, 80], ["汽車停車場", 72, 4, 84, 15],
        ["機車停車場", 68, 4, 71.5, 17.5], ["汽車停車場(南)", 5, 88, 16, 94], ["機車停車場(南)", 14, 94, 24, 97],
        ["自行車停車場", 26, 94, 36, 97], ["汽車停車場(文華路)", 2.5, 27, 5.5, 73], ["噴水池", 6, 75, 9, 80],
        ["榕榕大道", 10, 75, 17, 80], ["草坪(行政二館旁)", 19, 75, 26, 80]
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
        [23, "黑色長夾", "裡面有學生證跟一些零錢", null, "保存中", "2026-06-21 18:00:00"]
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
        [4, "純討論", "這學期的專題進度好趕，大家都做到哪裡了？"],
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