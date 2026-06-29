# 📘 คู่มือการติดตั้ง Repository บน GitHub และ Deploy GitHub Pages

> ไฟล์หลัก: `index.html` | เป้าหมาย: เผยแพร่เว็บผ่าน GitHub Pages

---

## 📋 สารบัญ

1. [สมัคร / เข้าสู่ระบบ GitHub](#1-สมัคร--เข้าสู่ระบบ-github)
2. [สร้าง Repository ใหม่](#2-สร้าง-repository-ใหม่)
3. [อัปโหลดไฟล์ index.html ผ่านเบราว์เซอร์](#3-อัปโหลดไฟล์-indexhtml-ผ่านเบราว์เซอร์)
4. [อัปโหลดผ่าน Git Command Line](#4-อัปโหลดผ่าน-git-command-line-ทางเลือก)
5. [เปิดใช้งาน GitHub Pages](#5-เปิดใช้งาน-github-pages-deploy)
6. [ตรวจสอบว่า Deploy สำเร็จ](#6-ตรวจสอบว่า-deploy-สำเร็จ)
7. [อัปเดตไฟล์ในครั้งถัดไป](#7-อัปเดตไฟล์ในครั้งถัดไป)
8. [สรุปขั้นตอนทั้งหมด](#8-สรุปขั้นตอนทั้งหมด)

---

## 1. สมัคร / เข้าสู่ระบบ GitHub

1. เปิดเบราว์เซอร์ไปที่ [https://github.com](https://github.com)
2. คลิก **Sign up** เพื่อสมัครสมาชิก หรือ **Sign in** หากมีบัญชีแล้ว
3. กรอกอีเมล รหัสผ่าน และ **username**
4. ยืนยันอีเมลที่ได้รับ

> 💡 **แนะนำ:** ตั้ง username ให้สื่อความหมาย เพราะจะปรากฏใน URL ของ GitHub Pages  
> รูปแบบ URL: `https://username.github.io/repo-name/`

---

## 2. สร้าง Repository ใหม่

1. คลิกไอคอน **`+`** มุมบนขวา → เลือก **New repository**
2. กรอก **Repository name** เช่น `vehicle-permit-wing21`
3. เลือก **Public** ✅ *(จำเป็นสำหรับ GitHub Pages แบบฟรี)*
4. ติ๊ก **Add a README file** *(ไม่บังคับ แต่แนะนำ)*
5. คลิก **Create repository**

> ⚠️ **หมายเหตุ:** ชื่อ Repository ต้องไม่มีช่องว่าง ใช้ขีดกลาง `-` แทน  
> เช่น `vehicle-permit-wing21` ✅ | `vehicle permit wing21` ❌

---

## 3. อัปโหลดไฟล์ index.html ผ่านเบราว์เซอร์

> วิธีนี้ไม่ต้องติดตั้งโปรแกรมเพิ่มเติม เหมาะสำหรับผู้เริ่มต้น

1. เปิด Repository ที่เพิ่งสร้าง
2. คลิก **Add file** → **Upload files**
3. ลาก `index.html` มาวางในกรอบ หรือคลิก **choose your files**
4. เลื่อนลงมาใส่ข้อความ Commit เช่น `Add index.html`
5. เลือก **Commit directly to the `main` branch**
6. คลิก **Commit changes**

> ⚠️ **สำคัญ:** ชื่อไฟล์ต้องเป็น `index.html` **ตัวพิมพ์เล็กทั้งหมด**  
> GitHub Pages จะโหลดไฟล์นี้เป็นหน้าแรกอัตโนมัติ

---

## 4. อัปโหลดผ่าน Git Command Line *(ทางเลือก)*

> ต้องติดตั้ง [Git](https://git-scm.com/downloads) ก่อน จึงจะใช้วิธีนี้ได้

เปิด **Command Prompt** หรือ **Terminal** แล้วรันคำสั่งตามลำดับ:

```bash
# 1. เข้าไปยังโฟลเดอร์ที่มี index.html
cd "C:\Users\LENOVO\Desktop\vehicle permit wing21\github"

# 2. เริ่มต้น Git repository
git init

# 3. เชื่อมกับ GitHub repository ที่สร้างไว้
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 4. เพิ่มไฟล์เข้า staging
git add index.html

# 5. Commit พร้อมข้อความ
git commit -m "Add index.html"

# 6. Push ขึ้น GitHub
git push -u origin main
```

> 💡 เปลี่ยน `YOUR_USERNAME` และ `YOUR_REPO_NAME` ให้ตรงกับของคุณ

---

## 5. เปิดใช้งาน GitHub Pages (Deploy)

1. ไปที่ Repository ของคุณบน GitHub
2. คลิก **Settings** ⚙️ (แถบเมนูด้านบน)
3. เลื่อนดูแถบซ้าย → คลิก **Pages**
4. ในส่วน **Build and deployment** ตั้งค่าดังนี้:

   | ตัวเลือก | ค่าที่ต้องตั้ง |
   |----------|--------------|
   | Source   | `Deploy from a branch` |
   | Branch   | `main` |
   | Folder   | `/ (root)` |

5. คลิก **Save**

> ✅ รอประมาณ **1–3 นาที** GitHub จะแสดง URL ของ GitHub Pages ในรูปแบบ:  
> `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 6. ตรวจสอบว่า Deploy สำเร็จ

1. กลับไปที่ **Settings → Pages**
2. จะเห็นข้อความสีเขียว:  
   > ✅ *Your site is published at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`*
3. คลิก URL นั้นเพื่อเปิดเว็บไซต์

### 🔧 แก้ปัญหาที่พบบ่อย

| ปัญหา | วิธีแก้ |
|-------|---------|
| หน้าว่าง / ไม่มีเนื้อหา | ตรวจสอบว่าไฟล์ชื่อ `index.html` (ตัวพิมพ์เล็ก) |
| Error 404 | ตรวจสอบว่าไฟล์อยู่ที่ root ของ repository ไม่ใช่ในโฟลเดอร์ย่อย |
| ยังไม่อัปเดต | รอให้ build เสร็จ ดูได้ที่แท็บ **Actions** |
| Branch ไม่ถูกต้อง | ตรวจสอบว่าเลือก branch `main` ใน Settings → Pages |

---

## 7. อัปเดตไฟล์ในครั้งถัดไป

### วิธีที่ 1: ผ่านเบราว์เซอร์
1. ไปที่ GitHub → Repository → คลิกไฟล์ `index.html`
2. คลิกไอคอนดินสอ ✏️ เพื่อแก้ไข หรืออัปโหลดไฟล์ใหม่ทับ
3. Commit changes → GitHub Pages จะ deploy อัตโนมัติภายใน 1–2 นาที

### วิธีที่ 2: ผ่าน Git CLI
```bash
git add index.html
git commit -m "Update index.html"
git push
```

> 💡 ดู log การ deploy ได้ที่แท็บ **Actions** ใน Repository

---

## 8. สรุปขั้นตอนทั้งหมด

```
1. สมัคร/เข้าสู่ระบบ GitHub
         ↓
2. สร้าง Repository (ตั้งเป็น Public)
         ↓
3. อัปโหลดไฟล์ index.html ไปยัง branch main
         ↓
4. Settings → Pages → Source: main / (root) → Save
         ↓
5. รอ 1–3 นาที
         ↓
6. เปิด URL: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## 🔗 ลิงก์ที่เป็นประโยชน์

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git Download](https://git-scm.com/downloads)
- [GitHub Sign Up](https://github.com/signup)

---

*คู่มือนี้จัดทำสำหรับโครงการ Vehicle Permit Wing 21*
