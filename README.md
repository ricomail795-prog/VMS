# VMS (Vessel Management System)

A lightweight web-based Vessel Management System (VMS) built with **HTML, CSS, and JavaScript**.  
Designed for use on shared vessel laptops with support for **multi-user accounts, multiple languages, auto-logout, and messaging**.

---

## 🚀 Features
- **Login & Registration**
  - Language selected at login (default English).
  - Register new accounts with Username, Password, Role (Admin, Crew, Manager).
  - Preferred Language chosen at login or changed later in Settings.

- **User Roles**
  - **Admin**: Full access, forced to English by default (can temporarily switch language in Settings).
  - **Crew**: Access to own account, messaging, settings, profile.
  - **Manager**: Same as Crew, with additional management features (expandable).

- **Settings**
  - Change **Preferred Language**.
  - Set **Auto Logout time** (15 mins, 30 mins, 1 hr, or Stay Logged In up to 12h).
  - **Day/Night theme** toggle.
  - **Screenshot tool** (capture + attach to messages).

- **Messaging**
  - Send/receive messages between users.
  - Attach **files** or **screenshots**.
  - Unread messages show a **red badge** in the sidebar.
  - Delete messages only removes them from **your inbox**, not the recipient’s.

- **Auto Logout**
  - User-configurable timeout.
  - 12-hour safety cap on "Stay Logged In".
  - 1-minute warning banner before auto logout (must click **Stay Logged In**).

- **Navigation**
  - Sidebar layout with **Dashboard**, **Profile**, **Users** (Admin only).
  - **Messages, Settings, Logout pinned to bottom** of sidebar.

---

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/VMS.git
cd VMS
