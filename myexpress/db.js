import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db', 'sqlite.db');

// 開啟資料庫，如果不存在會自動建立（由 OPEN_CREATE 旗標控制）
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
    // 建立 Locations table
    db.run(`CREATE TABLE IF NOT EXISTS Locations (
      location_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      x_coordinate REAL NOT NULL,
      y_coordinate REAL NOT NULL
    )`, (err) => {
      if (err) console.error('建立 Locations table 失敗:', err.message);
    });

    // 建立 Users table
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('Admin', 'Student')) NOT NULL
    )`, (err) => {
      if (err) console.error('建立 Users table 失敗:', err.message);
    });

    // 建立 Lost_Items table
    db.run(`CREATE TABLE IF NOT EXISTS Lost_Items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER,
      description TEXT NOT NULL,
      photo_path TEXT,
      status TEXT CHECK(status IN ('保存中', '已認領', '已銷毀')) DEFAULT '保存中',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES Locations(location_id)
    )`, (err) => {
      if (err) console.error('建立 Lost_Items table 失敗:', err.message);
    });

    seedData();
  });
}

function seedData() {
  // 新增 Locations 資料
  db.get("SELECT COUNT(*) AS count FROM Locations", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Locations (name, x_coordinate, y_coordinate) VALUES (?, ?, ?)");
      const locations = [
        ["學思樓", 10.0, 20.0],
        ["文華創意中心", 5.0, 25.0],
        ["土木水利館", 15.0, 30.0],
        ["理學大樓", 25.0, 30.0],
        ["育樂館", 10.0, 45.0],
        ["語文大樓", 10.0, 55.0],
        ["建築館", 5.0, 60.0],
        ["忠勤樓", 10.0, 70.0],
        ["第一招待所", 25.0, 55.0],
        ["工學館", 25.0, 65.0],
        ["人言大樓", 40.0, 55.0],
        ["人社館", 55.0, 55.0],
        ["電通館", 65.0, 55.0],
        ["資訊電機館", 55.0, 65.0],
        ["行政大樓", 15.0, 85.0],
        ["行政二館", 25.0, 85.0],
        ["丘逢甲紀念館", 35.0, 90.0],
        ["圖書館", 45.0, 85.0],
        ["科學與航太館", 50.0, 95.0],
        ["商學大樓", 65.0, 90.0],
        ["共善樓", 85.0, 60.0],
        ["體育館", 40.0, 15.0],
        ["游泳池", 55.0, 15.0],
        ["iHub", 60.0, 10.0]
      ];
      locations.forEach(loc => stmt.run(loc));
      stmt.finalize();
      console.log("Locations 資料新增完成");
    }
  });

  // 新增 Users 資料
  db.get("SELECT COUNT(*) AS count FROM Users", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)");
      const users = [
        ["admin_center", "hashed_pwd_888", "Admin"],
        ["admin_lib", "hashed_pwd_999", "Admin"],
        ["D1358010", "hashed_pwd_000", "Student"]
      ];
      users.forEach(user => stmt.run(user));
      stmt.finalize();
      console.log("Users 資料新增完成");
    }
  });

  // 新增 Lost_Items 資料
  db.get("SELECT COUNT(*) AS count FROM Lost_Items", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO Lost_Items (location_id, description, photo_path, status, created_at) VALUES (?, ?, ?, ?, ?)");
      // 由於給定的資料比資料表欄位多了一個詳細地點，我將他合併進 description 欄位中
      const items = [
        [8, "黑色 Sony 藍芽耳機，右耳有小刮痕", "https://example.com/img/earphone.jpg", "保存中", "2026-06-18 10:15:00"],
        [18, "透明水壺，蓋子是藍色的", "https://example.com/img/bottle.jpg", "已認領", "2026-06-17 14:30:00"],
        [22, "一串鑰匙，上面有柴犬吊飾", "https://example.com/img/keys.jpg", "保存中", "2026-06-18 09:00:00"],
        [14, "微積分原文書，內頁有螢光筆筆記", "https://example.com/img/book.jpg", "已銷毀", "2026-01-10 16:45:00"]
      ];
      items.forEach(item => stmt.run(item));
      stmt.finalize();
      console.log("Lost_Items 資料新增完成");
    }
  });
}

export default db;
