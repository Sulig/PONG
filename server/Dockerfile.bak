FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma y bcrypt
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    python3 \
    make \
    g++

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo dev para TypeScript)
# Si package-lock.json está desincronizado, npm ci fallará
# En ese caso, usar npm install que actualizará el lock file
RUN if [ -f package-lock.json ]; then \
        npm ci || npm install; \
    else \
        npm install; \
    fi

# Instalar Prisma CLI globalmente para migraciones
RUN npm install -g prisma

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript (necesita devDependencies)
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Comando de inicio (espera a que Vault esté listo antes de iniciar)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

