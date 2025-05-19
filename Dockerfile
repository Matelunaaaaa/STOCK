# Imagen base
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar dependencias desde la carpeta "server"
COPY app/server/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código del servidor
COPY app/server ./

# Copiar los archivos estáticos
COPY app ./app

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
