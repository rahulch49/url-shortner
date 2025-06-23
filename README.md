# 🔗 URL Shortener — Microservices Project

This is a simple and scalable URL shortener built using **Node.js**, **TypeScript**, and **Redis**. The project is split into microservices and containerized using Docker, making it easier to learn and experiment with modern backend architecture patterns.

---

## 🛠 Tech Stack

- **Node.js + Express** – for building API and redirect services
- **TypeScript** – for type safety and better DX
- **Redis** – used as an in-memory store to map short URLs to original ones
- **Docker + Docker Compose** – to run services in isolated containers
- **PNPM** – for faster dependency management

⚙️ How to Run the Project:

Make sure you have Docker installed. Then:

1. Clone the repo:

    git clone https://github.com/rahulch49/url-shortner.git
    cd url-shortner

2. Start the services:

    docker compose up --build

3. You should now have:

    API service running on http://localhost:3001

    Redirect service on http://localhost:3002

🔍 How It Works:

➕ Shorten a URL
    Send a POST request to the API:

    curl -X POST http://localhost:3001/shorten \
        -H "Content-Type: application/json" \
        -d '{"originalUrl": "https://youtube.com"}'
Response:

    {
    "shortUrl": "http://localhost:3002/_abc12",
    "shortId": "_abc12"
    }

🔁 Redirect
Access the short URL:

    curl -i http://localhost:3002/_abc12

You’ll be redirected to the original link.


Why Microservices?

I used this project to explore breaking down a backend app into small services:

    - The API service is responsible only for creating short URLs.

    - The Redirect service only handles redirection logic.

    - Redis acts as the shared database.

This separation makes it easier to scale and maintain individual parts of the system.