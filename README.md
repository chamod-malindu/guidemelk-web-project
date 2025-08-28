<p align="center">
  <img src="public/logo.png" alt="GuidMeLK Logo" width="600" />
</p>

<p align="center">
  A digital platform that connects tourists with local guides in Sri Lanka.<br />
  Built to promote sustainable tourism, authentic travel experiences, and empower local guides.
</p>

---

## 📚 Project Overview

**GuidMeLK** is a responsive web platform designed to directly connect **tourists** with **local tour guides** in Sri Lanka. Tourists can search, compare, and book guides based on **destination, language, price, and reviews**, while guides can showcase their services and availability. The platform also supports **real-time chat, secure payments, and ratings/reviews**, helping to build trust and promote sustainable tourism.

This project is developed as part of the **Independent Study Project I** for the ICT degree program at **Uva Wellassa University of Sri Lanka (2022/2023 Batch)**.

---

## 🚀 Key Features

- **🔐 User Authentication & Roles**
  - Email/password login with JWT
  - Google Sign-in with NextAuth
  - Email verification via Nodemailer
  - Role-based dashboards: **Tourist / Guide / Admin**

- **👤 Profile Management**
  - Tourists: update personal info, preferences
  - Guides: showcase services, pricing, languages, availability
  - Admin: monitor users, disputes, and reports

- **💬 Real-time Messaging**
  - Built with **Socket.IO**
  - One-to-one and one-to-many chat between tourists and guides
  - Seen/delivered indicators

- **📅 Booking System**
  - Tourists can book guides directly
  - Advance payment (20%) and remaining balance handling
  - Guide availability management

- **💳 Payments (Planned)**
  - Support for **Card, Bank Transfer, and PayPal** 
  - Records stored in MongoDB (`payments` collection)
  - Advance vs. Remaining payment logic

- **⭐ Reviews & Ratings**
  - Tourists can review guides after trips
  - Rating system to highlight top guides

- **🔔 Notifications**
  - New booking alerts
  - Payment confirmations
  - Review & rating updates

- **🛡️ Admin Dashboard**
  - Manage users, bookings, disputes
  - Monitor transactions
  - Oversee platform activity

---

## 🛠️ Tech Stack

| Layer               | Technology                                   |
| ------------------- | -------------------------------------------- |
| **Frontend**        | Next.js (React), Tailwind CSS                |
| **Backend**         | Next.js API routes (Node.js)                 |
| **Database**        | MongoDB                                     |
| **Auth**            | JWT, NextAuth (Google Sign-in)              |
| **Email**           | Nodemailer (for email verification)         |
| **Messaging**       | Socket.IO                                   |
| **Version Control** | Git + GitHub                                |
| **Design**          | Figma / Canva                               |

---

## 🏗️ System Development Approach

The project follows the **Waterfall model**, with phases for requirement gathering, design, implementation, testing, and deployment. Each step is completed before moving to the next, ensuring a structured development flow.

---

## 👥 Team Members

Meet the development team behind **GuidMeLK** (Group 08 – UWU/ICT/22):

| Name                  | Role                   | GitHub (Sample)                          | LinkedIn (Sample)                  |
| --------------------- | ---------------------- | ---------------------------------------- | ---------------------------------- |
| **Chamod Malindu**    | Full Stack Developer   | [@chamodmalindu](https://github.com/)    | [LinkedIn](https://linkedin.com/)  |
| **Poojani Ranasinghe**| Frontend Developer      | [@poojaniran](https://github.com/)       | [LinkedIn](https://linkedin.com/)  |
| **Chamodi Aponsu**    | Frontend Developer     | [@chamodiaponsu](https://github.com/)    | [LinkedIn](https://linkedin.com/)  |
| **Thisara Randima**   | UI/UX Designer         | [@thisararandima](https://github.com/)   | [LinkedIn](https://linkedin.com/)  |
| **Hiruni Pamudika**   | Documentation & QA     | [@hirunipamudika](https://github.com/)   | [LinkedIn](https://linkedin.com/)  |

---

## 💡 Why We Built This

Sri Lanka’s tourism industry contributes significantly to the economy, yet **tourists struggle to directly connect with reliable local guides**. Existing platforms mainly highlight travel agencies rather than freelance guides. GuidMeLK aims to:

- Empower local guides with a direct digital platform
- Help tourists find authentic, cultural travel experiences
- Promote **sustainable tourism** by supporting local talent
- Build trust through reviews, ratings, and secure payments

---

> ⭐ If you find this project useful or inspiring, please consider starring the repo and following our journey. Thank you!
