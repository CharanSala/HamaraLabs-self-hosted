# 🧪 HamaraLabs – Digital Solution for Tinkering Lab Activity Management

**HamaraLabs** is a role-based web application designed to digitize and manage activities at Atal Tinkering Labs (ATLs). It enables schools, students, mentors, and administrators to collaboratively manage innovation programs, competitions, and learning activities.

---

## 🎯 Objective

To streamline the onboarding, management, and reporting of ATL activities through a user-friendly digital platform that supports:
- School and student registrations
- Mentor and team management
- Activity and project assignments
- Difficulty adjustments by mentors
- Reports for all entities

---

## 🧩 Key Modules & Features

| Module                     | Forms Available                  | Reports Available         |
|---------------------------|----------------------------------|---------------------------|
| 🏫 School                 | School Onboarding                | School Report             |
| 👨‍🎓 Student             | Student Registration             | Student Report            |
| 🧑‍🏫 Mentor              | Mentor Registration              | Mentor Report             |
| 🧑‍🤝‍🧑 Teams             | Team Creation                    | Team Report               |
| 🛠️ Tinkering Activity   | Add Activities                   | Activity Report           |
| 🏆 Competitions          | Create Competitions              | Competition Report        |
| 📚 Courses               | Add Courses                      | Course Report             |
| 💡 Projects              | Add Projects                     | Project Report            |
| 🤝 Partners              | Onboard Partners                 | Partner Report            |

---

## 🧠 Smart Mentorship Logic

Mentors can **reduce the complexity level** of tinkering activities based on the student's understanding, ensuring personalized learning and inclusive innovation.

---

## 🛠 Tech Stack

| Layer        | Technology                               |
|--------------|-------------------------------------------|
| Frontend     | Next.js (App Router) + TypeScript        |
| Styling      | Tailwind CSS                             |
| Backend      | Prisma ORM + PostgreSQL (via AuthentiK)  |
| Validation   | Zod                                       |
| Auth         | AuthentiK (JWT + Role-based Access)      |
| Deployment   | Vercel / Railway / Self-hosted           |

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/CharanSala/HamaraLabs-self-hosted.git
cd HamaraLabs-self-hosted
