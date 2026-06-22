## Context

目前學校中尚無統一的失物招領平台，學生的發文散落各處。本專案將建置一個結合圖片互動校園地圖與討論區的新系統。前端預期使用 Vue.js，後端則以 Express.js 及 SQLite 建構輕量且具備完整驗證機制的平台。

## Goals / Non-Goals

**Goals:**
- 提供以百分比定位的 RWD 互動式校園地圖。
- 支援圖片上傳與簡單的狀態追蹤（保存中、已認領、已銷毀）。
- 實作三層權限架構：訪客、學生、管理員。
- 提供相關或尋物主題的學生討論區。

**Non-Goals:**
- 不串接複雜的真實地圖 (Google Maps 等)，以純 JPG 底圖即可。
- 暫不實作複雜的即時推播通知。
- 暫不實作外部 Oauth 社群登入 (如 Google 登入)。

## Decisions

- **Database: SQLite**
  - **Rationale**: 此系統資料量不大，欄位相對單純 (User, Item, Post)，SQLite 足以支撐並能維持專案之極簡部署。
- **Map Visualization: Percentage-based Positions on Image**
  - **Rationale**: 校園地圖只需一張固定圖片，地標(Pin)透過 `top: Y%; left: X%` 絕對定位，即使網頁縮放也能確保地標位於正確大樓上。
- **Image Uploads: Multer**
  - **Rationale**: 使用 Node.js 常見的 Multer 中介軟體處理 `multipart/form-data`，儲存至 `myexpress/uploads/` 目錄並產出靜態資源 URL 給前端顯示。
- **Role Control: JWT or Session**
  - **Rationale**: 實作簡單的 Token 驗證機制區分 student 與 admin 的不同操作權限。實體管理員與系統管理員皆需以此系統操作，以防資料分歧。

## Risks / Trade-offs

- **Risk: 不當圖片上傳**
  - **Mitigation**: 系統要求實名學號註冊登入，並賦予管理員刪除文章與物品權限，以此達到嚇阻及迅速下架的作用。
- **Risk: 圖片容量導致硬碟空間不足**
  - **Mitigation**: 使用 Multer 限制單張圖片上傳容量 (例如限制為最大 5MB)，降低伺服器儲存壓力。