# Utilizar una imagen base de Node.js
FROM node:18-alpine AS builder

# Instalar dependencias necesarias para compilación (si es necesario)
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  cairo-dev \
  pango-dev \
  giflib-dev \
  pixman-dev \
  libc6-compat \
  pkgconfig

# Establecer directorio de trabajo
WORKDIR /app

# Copiar el archivo de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Fase final: utilizar una imagen más liviana para producción
FROM node:18-alpine AS production

# Establecer directorio de trabajo
WORKDIR /app

# Copiar los archivos de la fase anterior
COPY --from=builder /app /app

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación en producción
CMD ["npm", "start"]
