# 📚 BookShelf

เว็บร้านขายหนังสือออนไลน์แบบจำลอง (หน้าเว็บ + เซิร์ฟเวอร์ **Express**) — เซิร์ฟเวอร์ Express ทำหน้าที่ส่งหน้า `index.html` ให้เบราว์เซอร์ ส่วนฟีเจอร์ร้านค้า (ค้นหา, กรองหมวดหมู่, ตะกร้า) ทำงานฝั่งเบราว์เซอร์ด้วย JavaScript

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.3-000000?logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

## สารบัญ

- [ภาพรวม](#ภาพรวม)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
- [Express Server](#express-server)
- [Routes](#routes)
- [รันด้วย Docker](#รันด้วย-docker)
- [ฟีเจอร์ฝั่งหน้าเว็บ](#ฟีเจอร์ฝั่งหน้าเว็บ)
- [ข้อควรรู้](#ข้อควรรู้)
- [แนวทางต่อยอด](#แนวทางต่อยอด)
- [License](#license)

## ภาพรวม

| ส่วน | หน้าที่ |
|------|---------|
| `app.js` (Express) | เปิดเซิร์ฟเวอร์ที่พอร์ต `8080` และส่ง `index.html` เมื่อมีคนเข้า `/home` |
| `index.html` | หน้าร้านหนังสือ — ข้อมูลหนังสือ 8 เล่มเขียนไว้ใน JavaScript ในไฟล์เดียวกัน |
| `Dockerfile` | แพ็กแอปเป็น container (Node 20 Alpine) |

> ตอนนี้โปรเจกต์ยังไม่มีฐานข้อมูลและยังไม่มี API — ข้อมูลหนังสือและตะกร้าอยู่ในหน่วยความจำของเบราว์เซอร์ และจะหายเมื่อรีเฟรชหน้า

## Tech Stack

- **[Express](https://expressjs.com/) `^5.3.0`** — เว็บเซิร์ฟเวอร์ (ใช้แบบ ES Modules)
- **Node.js** — runtime (Dockerfile ใช้ `node:20-alpine`)
- **Tailwind CSS (CDN)**, **Font Awesome**, **Google Fonts (Prompt / Sarabun)** — ตกแต่งหน้าเว็บ
- **Vanilla JavaScript** — ตรรกะฝั่งหน้าเว็บทั้งหมด

## โครงสร้างโปรเจกต์

```
-BookShelf/
├── app.js              # Express server (entry point)
├── index.html          # หน้าร้านหนังสือ (HTML + JS ในไฟล์เดียว)
├── style.css           # ว่างเปล่า — ยังไม่ได้ใช้งาน
├── Dockerfile          # สร้าง image สำหรับรันบน Docker
├── package.json        # dependencies (express)
└── package-lock.json
```

## เริ่มต้นใช้งาน

**ความต้องการ:** Node.js 20.19+ หรือ 22.7+ (ดูเหตุผลใน [ข้อควรรู้](#ข้อควรรู้))

```bash
# 1. โคลนโปรเจกต์
git clone https://github.com/Samniwut/-BookShelf.git
cd -BookShelf

# 2. ติดตั้ง dependencies
npm install

# 3. รันเซิร์ฟเวอร์
node app.js
```

จากนั้นเปิดเบราว์เซอร์ไปที่ 👉 **http://localhost:8080/home**

> ⚠️ เปิด `http://localhost:8080/` เฉย ๆ จะได้ `404` เพราะเซิร์ฟเวอร์ตั้ง route ไว้ที่ `/home` เท่านั้น

## Express Server

ไฟล์ `app.js` เป็นเซิร์ฟเวอร์ทั้งหมดของโปรเจกต์ ทำงาน 4 อย่างหลัก:

```js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();          // 1) สร้างแอป Express
const PORT = 8080;              //    พอร์ตที่เปิดรับ request

// 2) ใน ES Modules ไม่มี __dirname ให้ใช้ จึงต้องสร้างเอง
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3) กำหนด route: เมื่อมี GET /home ให้ส่งไฟล์ index.html กลับไป
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 4) เริ่มรับ request
app.listen(PORT, () => {});
```

| ส่วนของโค้ด | อธิบาย |
|-------------|--------|
| `express()` | สร้าง instance ของแอป ใช้กำหนด route และ middleware |
| `app.get(path, handler)` | ตอบ HTTP `GET` ที่ตรงกับ path ที่กำหนด |
| `res.sendFile()` | ส่งไฟล์กลับเป็น response — ต้องระบุ **absolute path** จึงใช้ `path.join(__dirname, ...)` |
| `app.listen(PORT, cb)` | เปิดเซิร์ฟเวอร์ที่พอร์ตนั้น และเรียก callback เมื่อพร้อมรับ request |
| `fileURLToPath(import.meta.url)` | วิธีหา `__dirname` เมื่อใช้ `import` (ES Modules) แทน `require` |

## Routes

| Method | Path | Response | หมายเหตุ |
|--------|------|----------|----------|
| `GET` | `/home` | `200` — ไฟล์ `index.html` | หน้าร้านหนังสือ |
| อื่น ๆ ทั้งหมด | `*` | `404` | Express ตอบ 404 ให้อัตโนมัติ |

## รันด้วย Docker

```bash
# สร้าง image
docker build -t bookshelf .

# รัน container (map พอร์ต 8080 ของเครื่อง → 8080 ของ container)
docker run --rm -p 8080:8080 bookshelf
```

เปิด http://localhost:8080/home

สิ่งที่ `Dockerfile` ทำ: ใช้ `node:20-alpine` → คัดลอก `package*.json` → `npm ci --omit=dev` (ติดตั้งเฉพาะ dependencies ที่ใช้จริง) → คัดลอกโค้ดทั้งหมด → เปิดพอร์ต `8080` → รัน `node app.js`

## ฟีเจอร์ฝั่งหน้าเว็บ

ทำงานใน `index.html` ทั้งหมด (ไม่ได้เรียก API จากเซิร์ฟเวอร์):

- 🔍 ค้นหาหนังสือตามชื่อหรือผู้เขียน
- 🗂️ กรองตามหมวดหมู่: พัฒนาตนเอง, บริหาร/ธุรกิจ, นิยาย/วรรณกรรม, เทคโนโลยี
- ↕️ เรียงตามยอดนิยม, ราคา (ต่ำ→สูง / สูง→ต่ำ), คะแนนรีวิว
- 🛒 ตะกร้าสินค้า — เพิ่ม/ลดจำนวน/ลบ และคำนวณราคารวม
- 📖 หน้าต่างรายละเอียดหนังสือ
- 🔐 หน้าต่างเข้าสู่ระบบและการชำระเงิน เป็นเพียง **การจำลอง** (ยังไม่ได้เชื่อมระบบจริง)

## ข้อควรรู้

- **ไม่มี `"type": "module"` ใน `package.json`** — `app.js` ใช้ `import` จึงอาศัยการตรวจจับ ES Module อัตโนมัติของ Node (Node 20.19+ / 22.7+) ซึ่งจะแสดง warning `MODULE_TYPELESS_PACKAGE_JSON` ตอนรัน ถ้าใช้ Node เวอร์ชันเก่ากว่านี้จะรันไม่ได้ แก้โดยเพิ่ม `"type": "module"` ใน `package.json`
- **ไม่มี `npm start`** — ปัจจุบันต้องรันด้วย `node app.js` (ดู [แนวทางต่อยอด](#แนวทางต่อยอด))
- **ยังไม่ได้เปิด static files** — `style.css` จึงเข้าถึงผ่านเซิร์ฟเวอร์ไม่ได้ (`404`) และตอนนี้ไฟล์ว่างเปล่าอยู่ด้วย หน้าเว็บใช้ Tailwind จาก CDN แทน จึงต้องมีอินเทอร์เน็ตตอนเปิดหน้าเว็บ
- **พอร์ตตายตัวที่ `8080`** — ยังไม่อ่านจาก environment variable
- **`.gitignore` กับไฟล์ที่ถูก commit** — `.gitignore` ระบุ `node_modules/`, `package.json`, `package-lock.json` แต่ไฟล์เหล่านี้ถูก commit เข้า repo ไปแล้ว ควรลบ `package.json` และ `package-lock.json` ออกจาก `.gitignore` (ทั้งสองไฟล์จำเป็นต่อ `npm ci` ใน Dockerfile) และเอา `node_modules` ออกจาก git ด้วย `git rm -r --cached node_modules`

## แนวทางต่อยอด

ตัวอย่างการเพิ่มความสามารถให้เซิร์ฟเวอร์ Express:

**1. เพิ่ม script สำหรับรัน** (`package.json`)

```json
{
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js"
  }
}
```

**2. เสิร์ฟ static files, redirect `/` ไป `/home` และอ่านพอร์ตจาก env**

```js
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.redirect("/home"));  // ต้องมาก่อน express.static
app.use(express.static(__dirname));                 // ให้เข้าถึง style.css ฯลฯ ได้
```

> ลำดับ middleware สำคัญใน Express — ถ้าวาง `express.static` ไว้ก่อน เส้นทาง `/` จะส่ง `index.html` ออกไปเลยโดยไม่ redirect

**3. ย้ายข้อมูลหนังสือมาเป็น REST API**

```js
app.use(express.json());

app.get("/api/books", (req, res) => res.json(books));

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});
```

แล้วให้ `index.html` ดึงข้อมูลด้วย `fetch("/api/books")` แทนข้อมูลที่เขียนไว้ในไฟล์

**4. อื่น ๆ ที่น่าทำต่อ** — เชื่อมฐานข้อมูล, ระบบสมัคร/เข้าสู่ระบบจริง, ระบบสั่งซื้อ, error-handling middleware

## License

ISC
