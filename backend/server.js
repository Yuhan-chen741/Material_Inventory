// backend/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// 允许跨域访问
app.use(cors());
app.use(express.json());

// 配置 Multer 存储，保存上传的图片到 uploads 文件夹
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 静态托管 uploads 文件夹，供前端访问图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 初始化并连接 SQLite 数据库
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('无法连接到数据库:', err.message);
  } else {
    console.log('已连接到 SQLite 数据库。');
    // 如果 materials 表不存在则创建
    db.run(`CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      density REAL NOT NULL,
      quantity INTEGER NOT NULL,
      volume REAL NOT NULL,
      lat TEXT NOT NULL,
      lng TEXT NOT NULL,
      imageUrl TEXT
    )`);
  }
});

// 文件上传接口：接收图片文件，返回图片 URL
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '没有上传文件' });
  }
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  return res.json({ success: true, imageUrl });
});

// 材料数据保存接口：接收材料数据，并存入 SQLite 数据库
app.post('/api/materials', (req, res) => {
  const { name, density, quantity, volume, lat, lng, imageUrl } = req.body;
  if (!name || !density || !quantity || !volume || !lat || !lng) {
    return res.status(400).json({ success: false, message: '缺少必要的材料数据' });
  }
  const sql = `INSERT INTO materials (name, density, quantity, volume, lat, lng, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [name, density, quantity, volume, lat, lng, imageUrl], function(err) {
    if (err) {
      console.error('插入材料数据出错:', err.message);
      return res.status(500).json({ success: false, message: '服务器错误' });
    }
    res.json({
      success: true,
      material: {
        id: this.lastID,
        name,
        density,
        quantity,
        volume,
        lat,
        lng,
        imageUrl
      }
    });
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
