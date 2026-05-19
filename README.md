# CloudCommerce

E-commerce frontend built with React 18, Vite, TailwindCSS, Zustand, and React Router. Includes Docker support for both development and production.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + JSX |
| Routing | React Router DOM v6 |
| State (cart) | Zustand |
| Styling | TailwindCSS v3 |
| Icons | Lucide React |
| Bundler | Vite 5 |
| Server (prod) | Nginx |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
CloudCommerce/
├── docker-compose.yml
├── CLAUDE.md               # AI coding guidelines
├── README.md
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   └── layout/
        │       ├── Navbar.jsx
        │       └── Footer.jsx
        │   └── products/
        │       └── ProductCard.jsx
        ├── data/
        │   └── products.js     # Static product catalog
        ├── pages/
        │   ├── Home.jsx
        │   ├── ProductListing.jsx
        │   ├── ProductDetail.jsx
        │   └── Cart.jsx
        └── store/
            └── cartStore.js    # Zustand cart state
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed, **or**
- Node.js 20+

### Run with Docker (Development)

Hot reload via Vite dev server on port `5173`:

```bash
docker compose --profile dev up
```

### Run with Docker (Production)

Builds the app and serves it via Nginx on port `80`:

```bash
docker compose up --build
```

### Run locally (no Docker)

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home / landing page |
| `/products` | Product listing with filters |
| `/products/:id` | Product detail |
| `/cart` | Shopping cart |

---

## Roadmap / Next Steps

- [ ] Backend API (Node.js / Express or similar)
- [ ] Authentication (login / register)
- [ ] Checkout flow & payment integration
- [ ] Product search & filtering
- [ ] Admin panel for product management
- [ ] Persistent cart (localStorage or backend)
- [ ] Unit & integration tests

---

## AI Coding Guidelines

See [CLAUDE.md](./CLAUDE.md) for the behavioral guidelines used when working with AI coding assistants on this project.
