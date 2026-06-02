# CloudCommerce Backend

Tres microservicios Node.js + Express, cada uno en su propio contenedor Docker.

| Servicio            | Puerto | Endpoints principales                                               |
| ------------------- | ------ | ------------------------------------------------------------------- |
| `products-service`  | 3001   | `GET /api/products`, `GET /api/products/:id`, `GET /health`         |
| `cart-service`      | 3002   | `GET/POST/PUT/DELETE /api/cart/:userId/items`, `GET /health`        |
| `checkout-service`  | 3003   | `POST /api/checkout`, `GET /api/orders/:id`, `GET /health`          |

El frontend usa rutas relativas (`/api/...`) — el ruteo lo hace Vite (dev), nginx (docker) o ALB (AWS).

---

## 1) Probar SOLO en local con Node (sin Docker)

Útil mientras desarrollas: cambios al código se ven al instante.

Abre **3 terminales**, una por servicio:

```powershell
# Terminal 1
cd backend\products-service ; npm install ; npm run dev

# Terminal 2
cd backend\cart-service ; npm install ; npm run dev

# Terminal 3
cd backend\checkout-service ; npm install ; npm run dev
```

Y una **4ª terminal** para el frontend (Vite hace proxy a los puertos 3001/3002/3003):

```powershell
cd frontend ; npm install ; npm run dev
```

Abre http://localhost:5173 — la app ya consume los 3 servicios.

### Smoke test directo a los servicios

```powershell
curl http://localhost:3001/api/products
curl http://localhost:3001/api/products/1
curl http://localhost:3002/api/cart/demo-user
curl -X POST http://localhost:3002/api/cart/demo-user/items `
  -H "Content-Type: application/json" `
  -d '{"id":1,"name":"iPhone 15","price":5899000,"quantity":1}'
curl -X POST http://localhost:3003/api/checkout `
  -H "Content-Type: application/json" `
  -d '{"userId":"demo-user","items":[{"id":1,"name":"iPhone 15","price":5899000,"quantity":1}]}'
```

---

## 2) Probar las imágenes Docker en local

Construye y levanta toda la pila (frontend nginx + 3 backends):

```powershell
docker compose up --build
```

- Frontend: http://localhost:80
- products-service: http://localhost:3001/api/products
- cart-service:     http://localhost:3002/api/cart/demo-user
- checkout-service: http://localhost:3003/health

El nginx del contenedor `frontend` redirige `/api/*` a los contenedores backend usando los nombres de servicio (`products-service`, `cart-service`, `checkout-service`) como DNS interno de Docker.

Apagar:

```powershell
docker compose down
```

Reconstruir solo un servicio:

```powershell
docker compose build products-service
docker compose up -d products-service
```

Ver logs:

```powershell
docker compose logs -f cart-service
```

---

## 3) Deploy en AWS — ECS Fargate + DynamoDB (cuenta Academy)

### Por qué esta combinación es la más barata para AWS Academy

- **Fargate** cobra por segundo de CPU/RAM. Con tareas chicas (256 CPU / 512 MB) y poco tráfico, se va en centavos.
- **DynamoDB on-demand** (PAY_PER_REQUEST): **$0** si no hay tráfico. RDS te cobra por hora aunque la BD esté ociosa — mata el crédito Academy en días.
- Sin NAT Gateway (usa subredes públicas con IPs públicas para las tareas) → ahorras ~$30/mes.

### Arquitectura

```
                        Internet
                            │
                  ┌─────────▼─────────┐
                  │  Application LB   │  (1 sola URL pública)
                  └─────────┬─────────┘
              ┌─────────────┼─────────────┬──────────────┐
              │/            │/api/products │/api/cart    │/api/checkout
       ┌──────▼─────┐ ┌─────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
       │ frontend   │ │ products-  │ │ cart-    │ │ checkout-   │  ECS Fargate
       │ (nginx)    │ │ service    │ │ service  │ │ service     │  tasks
       └────────────┘ └─────┬──────┘ └────┬─────┘ └──────┬──────┘
                            │             │              │
                            └─────────────▼──────────────┘
                                   DynamoDB (Products, Cart, Orders)
```

### Paso a paso

**3.1. Tablas DynamoDB** (Console → DynamoDB → Create table, modo **On-demand**):

| Tabla      | Partition key      | Sort key |
| ---------- | ------------------ | -------- |
| `Products` | `id` (Number)      | —        |
| `Cart`     | `userId` (String)  | —        |
| `Orders`   | `orderId` (String) | —        |

> Mientras pruebas la arquitectura puedes saltarte este paso: los servicios funcionan con almacenamiento en memoria. Migrar a DynamoDB es solo cambiar la capa de storage (instalar `@aws-sdk/client-dynamodb`, leer/escribir en vez de `Map`).

**3.2. Push de imágenes a ECR** (una vez por servicio):

```powershell
$ACCOUNT="123456789012"
$REGION="us-east-1"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin "$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"

foreach ($svc in @("products-service","cart-service","checkout-service","frontend")) {
  aws ecr create-repository --repository-name "cloudcommerce/$svc" --region $REGION 2>$null
  $path = if ($svc -eq "frontend") { "./frontend" } else { "./backend/$svc" }
  docker build -t "cloudcommerce/$svc" $path
  docker tag "cloudcommerce/$svc`:latest" "$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/cloudcommerce/$svc`:latest"
  docker push "$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/cloudcommerce/$svc`:latest"
}
```

**3.3. Cluster ECS Fargate** (Console → ECS → Create cluster → "AWS Fargate", default VPC).

**3.4. Task definitions** — una por servicio. Configuración mínima por tarea:

- Launch type: **Fargate**
- Task role: `LabRole` (en AWS Academy ya viene creado, dale permisos a DynamoDB)
- CPU: **256** (.25 vCPU), Memory: **512 MB**
- Container image: la URI de ECR
- Container port: 3001 / 3002 / 3003 / 80 según el servicio
- Health check command (opcional): `CMD-SHELL,curl -f http://localhost:PORT/health || exit 1`

**3.5. Application Load Balancer** (Console → EC2 → Load Balancers → Create ALB, internet-facing, default VPC, 2 AZs):

- Security group: permitir HTTP :80 desde 0.0.0.0/0
- Listener :80 → default action → target group `tg-frontend`

Crea **4 target groups** (tipo IP, porque Fargate awsvpc):

| Target group       | Puerto | Health check path |
| ------------------ | ------ | ----------------- |
| `tg-frontend`      | 80     | `/health`         |
| `tg-products`      | 3001   | `/health`         |
| `tg-cart`          | 3002   | `/health`         |
| `tg-checkout`      | 3003   | `/health`         |

En el listener :80 agrega **rules** (orden importa):

1. Path = `/api/products*` → forward to `tg-products`
2. Path = `/api/cart*`     → forward to `tg-cart`
3. Path = `/api/checkout*` o `/api/orders*` → forward to `tg-checkout`
4. Default → forward to `tg-frontend`

**3.6. Services ECS** (uno por task definition):

- Launch type: Fargate
- Number of tasks: 1
- Subnets: las 2 públicas de la VPC default
- Auto-assign public IP: **ENABLED** (esto evita pagar NAT Gateway)
- Security group: permitir tráfico desde el SG del ALB en el puerto del contenedor
- Load balancing: enlazar el target group correspondiente

**3.7. Probar**: el ALB te da un DNS tipo `cloudcommerce-alb-1234.us-east-1.elb.amazonaws.com`. Ábrelo en el browser → frontend cargando productos vía `/api/products`.

### Costos estimados (cuenta Academy, baja carga)

| Recurso              | Costo aprox / mes              |
| -------------------- | ------------------------------ |
| 4 tareas Fargate min | ~$10–15 (corriendo 24/7)       |
| ALB                  | ~$16 fijo + tráfico            |
| DynamoDB on-demand   | ~$0 con poco tráfico           |
| ECR storage          | $0.10/GB/mes                   |

> **Tip Academy**: para no quemar crédito, **detén los services ECS** (`desired count = 0`) cuando no estés probando. El ALB sigue cobrando: si vas a estar varios días sin probar, bórralo y recréalo después.

---

## Migrar a DynamoDB (cuando estés listo)

En cada servicio:

```powershell
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

Reemplaza el `Map` por llamadas a `GetCommand` / `PutCommand` / `DeleteCommand`. Las rutas Express no cambian. Las credenciales las toma automáticamente la **task role** (`LabRole` en Academy).

