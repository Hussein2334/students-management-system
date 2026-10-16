
# 🎓 ShulePro — Students Management System

Mfumo wa kisasa wa usimamizi wa wanafunzi uliojengwa kwa **React** (frontend) na **Django REST Framework** (backend). Unasaidia shule kusimamia wanafunzi, walimu, kozi, malipo, mahudhurio, na shughuli za mfumo.

![ShulePro](https://img.shields.io/badge/ShulePro-Digital%20Campus-3ecf8e?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=flat-square&logo=django&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

---

## 📋 Yaliyomo

- [Vipengele](#-vipengele)
- [Teknolojia](#-teknolojia)
- [Muundo wa Mradi](#-muundo-wa-mradi)
- [Usakinishaji](#-usakinishaji)
- [Mazingira (.env)](#-mazingira-env)
- [Kuanza](#-kuanza)
- [API Endpoints](#-api-endpoints)
- [Aina za Watumiaji](#-aina-za-watumiaji)
- [Leseni](#-leseni)

---

## ✨ Vipengele

### 👑 Admin
- 📊 Dashboard ya kisasa yenye **charts** (users, payments, courses)
- 👥 Usimamizi wa **watumiaji** (admin, teacher, student)
- 🎓 Usimamizi wa **wanafunzi**
- 👩‍🏫 Usimamizi wa **walimu**
- 📚 Usimamizi wa **kozi**
- 💳 Usimamizi wa **malipo** (M-Pesa, Tigo Pesa, Airtel Money, Cash, Bank)
- 📝 **System Logs** — kumbukumbu ya shughuli zote
- 📈 **Ripoti na takwimu** zenye charts nyingi
- ⚙️ **Mipangilio ya mfumo** (wasifu, usalama, notifications, taarifa za shule)

### 👩‍🏫 Teacher
- 📊 Dashboard yenye **charts** za kozi na wanafunzi
- 📚 **Kozi Zangu** — CRUD ya kozi zangu
- 🎓 **Wanafunzi** — orodha ya wanafunzi wote
- ⏰ **Mahudhurio** — simamia mahudhurio ya wanafunzi
- 🏆 **Matokeo** — ongeza na simamia matokeo (A, B, C, D, F)
- ⚙️ **Mipangilio** — wasifu, usalama, notifications, mapendeleo ya kufundisha

### 👨‍🎓 Student
- 📝 Kujisajili (self-registration)
- 📊 Dashboard yenye **charts** za malipo
- 📚 **Kozi Zinazopatikana** — kuona kozi zote
- 🏆 **Matokeo Yangu** — kuona matokeo
- 💳 **Malipo Yangu** — historia ya malipo
- 👤 **Wasifu** — wasifu wangu na upload avatar

### 🔐 Uthibitishaji & Usalama
- JWT authentication
- Kurejesha nenosiri kwa barua pepe
- Roles tatu (admin, teacher, student)
- Protected routes
- **System logs** — kumbukumbu ya kila kitu
- **Upload ya avatar** kwa watumiaji wote

---

## 🛠️ Teknolojia

### Frontend
| Package | Kazi |
|---------|------|
| React 18 | UI library |
| Vite | Build tool |
| React Router DOM | Routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Recharts | Charts na graphs |

### Backend
| Package | Kazi |
|---------|------|
| Django 5.x | Web framework |
| Django REST Framework | API |
| SimpleJWT | JWT auth |
| django-cors-headers | CORS |
| python-decouple | Environment variables |
| Pillow | Image handling |

### Database
- **SQLite** (development)
- **PostgreSQL** (production — inapendekezwa)

---

## 📁 Muundo wa Mradi

```
students-management-system/
│
├── backend/
│   └── core/
│       ├── accounts/           # Auth, Users, Activity Logs, Avatar
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── admin_serializers.py
│       │   ├── log_serializers.py
│       │   ├── permissions.py
│       │   ├── utils.py
│       │   ├── views.py
│       │   └── urls.py
│       ├── academics/          # Courses
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   └── urls.py
│       ├── payments/           # Payments
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   └── urls.py
│       ├── core/               # Settings, URLs
│       │   ├── settings.py
│       │   └── urls.py
│       ├── manage.py
│       ├── requirements.txt
│       └── .env
│
├── frontend/
│   └── src/
│       ├── api/                # Axios config
│       │   └── axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── dashboard/
│       │       └── DashboardLayout.jsx
│       ├── context/            # AuthContext
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   ├── Profile.jsx
│       │   ├── NotFound.jsx
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── ManageUsers.jsx
│       │   │   ├── ManageStudents.jsx
│       │   │   ├── ManageTeachers.jsx
│       │   │   ├── ManageCourses.jsx
│       │   │   ├── ManagePayments.jsx
│       │   │   ├── SystemLogs.jsx
│       │   │   ├── Reports.jsx
│       │   │   └── Settings.jsx
│       │   ├── teacher/
│       │   │   ├── TeacherDashboard.jsx
│       │   │   ├── TeacherCourses.jsx
│       │   │   ├── TeacherStudents.jsx
│       │   │   ├── TeacherAttendance.jsx
│       │   │   ├── TeacherResults.jsx
│       │   │   └── TeacherSettings.jsx
│       │   └── student/
│       │       ├── StudentDashboard.jsx
│       │       ├── StudentCourses.jsx
│       │       ├── StudentResults.jsx
│       │       └── StudentPayments.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── README.md
```

---

## 🚀 Usakinishaji

### 📋 Mahitaji ya Awali

Kabla ya kuanza, hakikisha una:

- ✅ **Python 3.12+** — [Download](https://www.python.org/downloads/)
- ✅ **Node.js 18+** — [Download](https://nodejs.org/)
- ✅ **Git** — [Download](https://git-scm.com/)
- ✅ **Gmail App Password** (kwa kurejesha nenosiri)

---

### 🐍 SEHEMU A: Backend (Django)

#### Hatua 1: Clone repository

```bash
git clone <repo-url>
cd students-management-system/backend/core
```

#### Hatua 2: Unda virtual environment

```bash
python -m venv venv
```

#### Hatua 3: Activate virtual environment

**Windows:**
```powershell
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

#### Hatua 4: Sakinisha packages zote za backend

```bash
pip install -r requirements.txt
```

#### 📄 `backend/core/requirements.txt`

```txt
# ===== Django Core =====
Django==5.0.1
djangorestframework==3.14.0

# ===== Authentication =====
djangorestframework-simplejwt==5.3.1

# ===== CORS =====
django-cors-headers==4.3.1

# ===== Environment Variables =====
python-decouple==3.8

# ===== Image Handling =====
Pillow==10.2.0

# ===== Production Server =====
gunicorn==21.2.0
whitenoise==6.6.0
```

#### Hatua 5: Unda `.env`

Kwenye `backend/core/`, unda faili `.env`:

```env
SECRET_KEY=django-insecure-change-me-put-something-long-and-random-1234567890
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-digit-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

FRONTEND_URL=http://localhost:5173
```

> 💡 **App Password:** Nenda [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) — weka 2-Step Verification kwanza.

#### Hatua 6: Fanya migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Hatua 7: Unda superuser (admin)

```bash
python manage.py createsuperuser
```

Jaza:
- **Email**: admin@example.com
- **Username**: admin
- **Password**: ******

#### Hatua 8: Anzisha backend

```bash
python manage.py runserver
```

Backend inakimbia: **http://127.0.0.1:8000** ✅

---

### ⚛️ SEHEMU B: Frontend (React + Vite)

#### Hatua 1: Nenda frontend

```bash
# Kwenye terminal mpya
cd students-management-system/frontend
```

#### Hatua 2: Sakinisha packages zote za frontend

```bash
npm install
```

#### 📄 `frontend/package.json`

```json
{
  "name": "shulepro-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx"
  },
  "dependencies": {
    "axios": "^1.6.5",
    "lucide-react": "^0.312.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.3",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.8"
  }
}
```

#### Hatua 3: Anzisha frontend

```bash
npm run dev
```

Frontend inakimbia: **http://localhost:5173** ✅

---

## 🔐 Mazingira (.env)

### `backend/core/.env`

```env
# ============================================
# DJANGO
# ============================================
SECRET_KEY=change-me-put-something-long-and-random
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# ============================================
# EMAIL (Gmail)
# ============================================
# Pata App Password: https://myaccount.google.com/apppasswords
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-digit-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# ============================================
# FRONTEND
# ============================================
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Kuanza

### 1. Kama Mwanafunzi (Register)
- Nenda `http://localhost:5173/register`
- Jaza fomu → unaelekezwa `/student/dashboard`

### 2. Kama Admin
- Ingia kwa email/password ya `createsuperuser`
- Unaelekezwa `/admin/dashboard`

### 3. Kama Teacher
- Walimu wanaongezwa na admin
- Ingia kwa email/password yao → unaelekezwa `/teacher/dashboard`

---

## 🔌 API Endpoints

### Authentication (`/api/auth/`)

| Method | Endpoint | Kazi | Ruhusa |
|--------|----------|------|--------|
| POST | `/register/` | Usajili (student) | Public |
| POST | `/login/` | Kuingia (email + password) | Public |
| POST | `/token/refresh/` | Refresh JWT | Public |
| GET/PATCH | `/profile/` | Taarifa za mtumiaji | Authenticated |
| POST | `/profile/avatar/` | Pakia avatar | Authenticated |
| DELETE | `/profile/avatar/delete/` | Futa avatar | Authenticated |
| POST | `/password-reset/` | Omba reset | Public |
| POST | `/password-reset-confirm/` | Weka nenosiri jipya | Public |

### Admin (`/api/auth/admin/`)

| Method | Endpoint | Kazi |
|--------|----------|------|
| GET | `/stats/` | Takwimu za dashboard |
| GET/POST | `/users/` | Watumiaji wote |
| GET/PATCH/DELETE | `/users/<id>/` | Mtumiaji mmoja |
| POST | `/users/<id>/toggle-active/` | Zuia/fungua |
| GET | `/logs/` | System logs |

### Teacher (`/api/auth/teacher/`)

| Method | Endpoint | Kazi |
|--------|----------|------|
| GET | `/stats/` | Takwimu za mwalimu |
| GET/POST | `/courses/` | Kozi zangu |
| GET | `/students/` | Wanafunzi wote |

### Student (`/api/auth/student/`)

| Method | Endpoint | Kazi |
|--------|----------|------|
| GET | `/stats/` | Takwimu za mwanafunzi |
| GET | `/courses/` | Kozi zinazopatikana |
| GET | `/payments/` | Malipo yangu |

### Courses (`/api/admin/courses/`)

| Method | Endpoint | Kazi |
|--------|----------|------|
| GET/POST | `/admin/courses/` | Kozi zote |
| GET/PATCH/DELETE | `/admin/courses/<id>/` | Kozi moja |

### Payments (`/api/admin/payments/`)

| Method | Endpoint | Kazi |
|--------|----------|------|
| GET/POST | `/admin/payments/` | Malipo yote |
| GET/PATCH/DELETE | `/admin/payments/<id>/` | Malipo moja |

---

## 👥 Aina za Watumiaji

| Role | Anaweza | Dashboard | Anaongezwa |
|------|---------|-----------|------------|
| 🔴 **Admin** | Kusimamia kila kitu | `/admin/dashboard` | `createsuperuser` |
| 🔵 **Teacher** | Kozi, wanafunzi, mahudhurio, matokeo | `/teacher/dashboard` | Na admin |
| 🟢 **Student** | Dashboard, kozi, matokeo, malipo | `/student/dashboard` | Self-registration |

---

## 🧪 Uchunguzi

### Backend
```bash
python manage.py test
```

### Frontend
```bash
npm run lint
```

---

## 🌐 Deployment (Production)

### Backend
- **Gunicorn** (application server)
- **Nginx** (reverse proxy)
- **PostgreSQL** (database)
- **Redis** (caching)

### Frontend
- **Vercel** au **Netlify**
- **Nginx** (kama unatumia VPS)

---

## 🐛 Kuchangia

1. Fork repository
2. Unda branch: `git checkout -b feature/feature-yako`
3. Commit: `git commit -m 'Ongeza feature'`
4. Push: `git push origin feature/feature-yako`
5. Unda Pull Request

---

## 📄 Leseni

**MIT License** — angalia [LICENSE](LICENSE)

---

## 👨‍💻 Mtengenezaji

**Hussein Abdulrahman**
- 📧 husseinabdulrahman2334@gmail.com
- 📞 +255 658 216 348
- 📍 Mombasa & Zanzibar

---

<div align="center">

**⭐ Kama mradi huu umekusaidia, tafadhali weka star!**

Made with ❤️ in Tanzania 🇹🇿

</div>
```

---

## 📌 Mabadiliko muhimu

| # | Kilichoongezwa/Kilichobadilishwa |
|---|-----------------------------------|
| 1 | **Teacher** — imeondolewa `*(inakuja)*` — sasa ina dashboards zote |
| 2 | **Student** — imeongezwa kozi, matokeo, malipo |
| 3 | **Muundo wa mradi** — imeonyeshwa faili zote ikiwa ni pamoja na `teacher/` na `student/` |
| 4 | **API Endpoints** — imeongezwa `/teacher/` na `/student/` sehemu |
| 5 | **Aina za Watumiaji** — imeondolewa `*(inakuja)*` |
| 6 | **Vipengele vya Admin** — imeongezwa "Ripoti" na "Mipangilio" |
| 7 | **Vipengele vya Teacher** — imeongezwa zote 6 (Dashboard, Courses, Students, Attendance, Results, Settings) |
| 8 | **Vipengele vya Student** — imeongezwa zote 4 (Dashboard, Courses, Results, Payments) + Profile |

---

## 📋 Orodha ya kukagua

| # | Kipengele | Hali |
|---|-----------|------|
| 1 | `README.md` imesasishwa | ⬜ |
| 2 | Inaonyesha vipengele vyote vya teacher | ⬜ |
| 3 | Inaonyesha vipengele vyote vya student | ⬜ |
| 4 | Inaonyesha muundo kamili | ⬜ |
| 5 | Inaonyesha API endpoints zote | ⬜ |

---

## 🎯 Fanya sasa

1. **Copy** README kamili juu
2. **Weka** kwenye `students-management-system/README.md`
3. **Save** (`Ctrl + S`)



🚀