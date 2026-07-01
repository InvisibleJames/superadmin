# MedReco Super Admin — ภาพรวมโปรเจกต์ (Project Overview)

เอกสารนี้อธิบายเนื้อหาที่แตกออกมาจาก `Super Admin MedReco-handoff.zip`
เพื่อให้ทีม (และ coding agent) เข้าใจว่าในโปรเจกต์มีอะไรบ้าง และตอนนี้ทำถึงไหนแล้ว

---

## สถานะปัจจุบัน (Status)

> **ขั้นดีไซน์เสร็จ — ยังไม่เริ่มพัฒนาโค้ดจริง (production)**

- เนื้อหาทั้งหมดเป็น **Design Handoff Bundle** ที่ export มาจาก Claude Design (claude.ai/design)
- เป็น prototype แบบ **HTML/CSS/JS** ใช้สื่อสารดีไซน์ ไม่ใช่โค้ดที่นำไปใช้งานจริง
- ยังไม่มีการ implement เป็น framework จริง (React / Vue / ฯลฯ), ยังไม่มี backend, ยังไม่มี test

---

## MedReco คืออะไร

**MedReco — Super Admin** คือหน้า back-office / admin console (ธีมมืด, เน้นข้อมูลหนาแน่น)
สำหรับให้ System Administrator ใช้จัดการระบบ EMR (Electronic Medical Records / เวชระเบียนอิเล็กทรอนิกส์)
ครอบคลุมการจัดการ clinics, branches, users, patients, roles, import/export และ audit logs
ขององค์กรด้านสุขภาพขนาดใหญ่

**อารมณ์ของโปรดักต์:** Powerful, trustworthy, efficient — ผสม Linear + Stripe Dashboard
เน้น productivity ไม่เน้นตกแต่ง

---

## โครงสร้างไฟล์ (Directory Structure)

```
super-admin-medreco/
├── README.md                       # คำแนะนำสำหรับ coding agent (อ่านก่อน implement)
└── project/
    ├── MedReco Super Admin.dc.html # ★ ดีไซน์หลัก — หน้า Super Admin app ทั้งหน้า
    ├── support.js                  # สคริปต์ประกอบ prototype
    ├── _ds/                        # Design System (ดูรายละเอียดด้านล่าง)
    │   └── medreco-design-system-*/
    │       ├── readme.md           # คู่มือ design language ฉบับเต็ม
    │       ├── styles.css          # entry point เดียวที่ consumer link
    │       ├── _ds_manifest.json   # รายการ component + starting points
    │       ├── _ds_bundle.js       # bundle ของ component
    │       └── tokens/             # design tokens (colors, typography, spacing, elevation, base)
    ├── assets/                     # medreco-mark.png (โลโก้), thai-districts.js, thai-tambon.js
    ├── screenshots/                # ภาพ mockup หลายเวอร์ชัน (v2, final, payment card ฯลฯ)
    └── uploads/                    # ภาพอ้างอิงที่ผู้ใช้แนบเข้ามา
```

---

## Design System

ระบบดีไซน์ถูกออกแบบไว้ครบ ประกอบด้วย:

### Design Tokens
- **Color** — ธีมมืด: canvas `#0B0F14` → sidebar → card → raised → input
  - Accent หลัก **Teal `#18C7B5`**, รอง **Blue `#2D7FF9`**, success **Green `#29D391`**
  - Brand gradient: `blue → teal → green` (ใช้เท่าที่จำเป็น)
  - Status: success / warning `#F5A524` / danger `#F4475A` / info
  - Role hues: Business Owner→amber, Director/Doctor→teal, Manager→violet, Staff→blue
- **Typography** — `Geist` (UI) + `Geist Mono` (ตัวเลข/ID/timestamp), body 14px, tabular numbers
- **Spacing** — 4px base grid, sidebar 256px (72px ตอนย่อ), top bar 64px, content cap 1440px
- **Border & Radius** — hairline 1px, radius หลัก 8px, การ์ดใหญ่ 12px, badge เป็น pill
- **Elevation & Motion** — เงานุ่ม, transition 150ms, drawer slide 260ms

### Components (`window.MedRecoDesignSystem_22e123`)
| กลุ่ม | Component |
|------|-----------|
| Forms | Button, IconButton, Input, Select, Checkbox |
| Data Display | Badge (status + role), Avatar, StatCard |
| Feedback | ProgressBar |

---

## หน้าจอที่ออกแบบแล้ว (Screens)

| หน้าจอ | สถานะ |
|--------|--------|
| **Users Management** — stats, search + filters, ตาราง enterprise (sorting, multi-select, sticky bulk toolbar, pagination, empty state) | ✅ ออกแบบครบ |
| **Import Drawer** — 5 ขั้นตอน (Upload → Validate → Preview → Import) พร้อม live progress | ✅ ออกแบบครบ |
| เมนูอื่น (Clinics, Branches, Roles & Permissions, Audit logs ฯลฯ) | ⚠️ เป็น placeholder |

---

## ขั้นต่อไป (Next Steps)

1. เลือก tech stack สำหรับ implement จริง (แนะนำ React + design tokens จาก `tokens/`)
2. Recreate หน้า **Users Management** และ **Import Drawer** ให้ pixel-perfect ตามดีไซน์
3. ต่อ backend / API สำหรับ users, roles, import/export, audit logs
4. ออกแบบ + implement หน้าที่ยังเป็น placeholder ให้ครบ

> หมายเหตุ: ดีไซน์เหล่านี้เป็น **การ recreate** จาก brand asset + reference screenshot + product brief
> (ไม่มี Figma / codebase ต้นทาง) และใช้ฟอนต์ Geist แทนฟอนต์แบรนด์จริงที่ยังไม่ได้ให้มา
