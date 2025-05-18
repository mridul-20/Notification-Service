# 📦 NotifyFlow — Notification Service

A full-stack notification service that enables sending and retrieving notifications via **Email**, **SMS**, and **In-App** notifications. Built with **Node.js (Express)** for the backend and **React + Tailwind CSS** for the frontend.

---

## 📑 Features

- ✅ Send Notifications (Email, SMS, In-App)
- ✅ Retrieve all notifications for a user
- ✅ Real-time In-App notifications (via WebSockets)
- 🌟 Bonus: Queue integration using RabbitMQ (optional)
- 🔁 Retry logic for failed notifications (optional)

---

## 🛠️ Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React, Tailwind CSS, Axios, Socket.io-client |
| Backend   | Node.js, Express, MongoDB, Socket.io         |
| Queue     | RabbitMQ (Optional - for async processing)   |
| Email/SMS | Nodemailer, Mock/Console-based SMS service   |

---

## 🚀 Project Structure

```
Notification-Service/
├── backend/             # Express server
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── queue/           # Optional: RabbitMQ
├── frontend/            # React app
│   ├── src/components/
│   └── src/pages/
├── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Notification-Service.git
cd Notification-Service
```

---

### 2. Backend Setup (`/backend`)
```bash
cd backend
npm install
```

#### ➕ Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### ▶ Start Backend Server:
```bash
npm start
```

---

### 3. Frontend Setup (`/frontend`)
```bash
cd ../frontend
npm install
```

#### ▶ Start Frontend Dev Server:
```bash
npm start
```

---

## 📬 API Endpoints

### ✅ `POST /notifications`
Send a new notification  
**Request Body Example:**
```json
{
  "userId": "123",
  "type": "email",
  "subject": "Welcome",
  "message": "Hello and welcome!"
}
```

---

### ✅ `GET /users/:id/notifications`
Retrieve all notifications sent to a user  
**Example:** `/users/123/notifications`

---

## 📌 Assumptions

- In-app notifications are shown in real-time via WebSockets (Socket.io)
- SMS notifications are simulated unless integrated with services like Twilio
- Email notifications use Nodemailer (via Gmail or SMTP)
- MongoDB is used to store user notification history
- Retry logic is added for failed notifications if RabbitMQ is active

---

## 🧪 Testing

You can test API endpoints using:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- Curl or frontend UI

---


## 📄 License

This project is licensed under the **MIT License**.

---

