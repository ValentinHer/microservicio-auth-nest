# microservicio-auth-nest

Microservicio de autenticación desarrollado con NestJS + TypeScript.

## 📄 Descripción

Este servicio se encarga de la lógica de autenticación (login, signup).  
Está pensado para usarse en unaa arquitectura de microservicios — ideal para integrarse con otros servicios (usuarios, API Gateway, etc.) — delegando la autenticación a un módulo centralizado.

## ⚙️ Requisitos

- Node.js 
- npm
- Variables de entorno (.env) — copia `.env.example` como `.env` y configura según tu entorno  

## 🚀 Instalación & Ejecución

# Instalar dependencias
```bash
npm install
```
# Para levantar la BD PostgreSQL
```bash
docker compose up -d
```

# Para parar la BD PostgreSQL
```bash
docker compose down
```

# Para desarrollo
```bash
npm run start:dev
```
