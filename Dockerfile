# Verwende ein Node.js-Image als Basis
FROM node:14

# Legen Sie den Arbeitsordner im Container fest
WORKDIR /app

# Kopieren Sie Ihre Anwendung in den Container
COPY . .

# Installieren Sie die Anwendungsabhängigkeiten
RUN npm install

# Stellen Sie die Anwendung bereit
EXPOSE 80
CMD ["npm", "run", "serve"]