# Vessel Management System (VMS)

A lightweight, browser-based system for managing vessel operations.  
Includes authentication, role-based access, messaging, logs, and settings.

## Features
- **User Accounts**: Register/login with role selection (Admin, Crew, Manager).
- **Preferred Language**: Choose from many languages, applied per user.
- **Messaging System**: Send/receive messages with attachments (screenshots, reports, documents).
- **Activity Logs**:
  - Per-user log (20 entries).
  - Global log (1000 entries per user, admin-only access).
  - Export options (CSV per user, filtered logs, or ZIP for all).
  - Admin can clear global logs; users can clear their own.
- **Settings**:
  - Change password, language, auto-logout time.
  - Auto-logout: 15 min, 30 min, 1 hour, stay logged in (max 12 hours).

## Deployment
This project is hosted with **GitHub Pages**:  
👉 [Live Site](https://ricomail795-prog.github.io/VMS/)

---

📌 Built with HTML, CSS, and JavaScript. Data is stored in `localStorage`.
