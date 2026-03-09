# AI SaaS – Code Debug & Email Copilot

AI SaaS is a full-stack web application that integrates AI to help developers and professionals automate tasks such as code debugging and email generation.

The project demonstrates modern SaaS architecture using Laravel API, React frontend, authentication, AI integration, and usage tracking.

---

## Features

* User Authentication (Register / Login)
* AI Code Debug Assistant
* AI Email Copilot
* AI Request History
* Daily Usage Limit (SaaS Model)
* Secure API using Laravel Sanctum
* Fast AI inference using Groq API
* React Dashboard UI

---

## Tech Stack

Backend

* Laravel 11
* Laravel Sanctum (API Authentication)
* MySQL Database

Frontend

* React.js (Vite)
* Axios
* React Router

AI Integration

* Groq API (LLM inference)

---

## Project Architecture

React Frontend → Laravel API → AI Provider (Groq) → Response → React UI

---

## Installation

Clone the repository

```
git clone https://github.com/yourusername/ai-saas.git
cd ai-saas
```

Install Laravel dependencies

```
composer install
```

Install frontend dependencies

```
cd frontend
npm install
```

---

## Environment Setup

Create `.env` file and configure:

```
DB_DATABASE=ai_saas
DB_USERNAME=root
DB_PASSWORD=

GROQ_API_KEY=your_api_key
```

Run migrations

```
php artisan migrate
```

---

## Run Backend

```
php artisan serve
```

---

## Run Frontend

```
cd frontend
npm run dev
```

Open:

```
http://localhost:5173
```

---

## API Features

Auth API

* POST /api/register
* POST /api/login
* POST /api/logout

AI APIs

* POST /api/debug-code
* POST /api/generate-email

History

* GET /api/history

---

## SaaS Logic

Free users have a daily request limit.
All AI requests are stored in the database for history tracking.

---

## Future Improvements

* Stripe payment integration
* Subscription plans
* Team workspaces
* Prompt templates
* AI analytics dashboard

---

## Author

Zeeshan Nasir

Full Stack Developer (Laravel + React)

---

## License

This project is open-source and available under the MIT License.
