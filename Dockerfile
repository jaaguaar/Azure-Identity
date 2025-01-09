# Використовуємо офіційний Node.js образ
FROM node:18

# Встановлюємо робочу директорію в контейнері
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код до контейнера
COPY . .

# Встановлюємо змінну середовища для production
ENV NODE_ENV=production

# Відкриваємо порт (за потреби)
EXPOSE 3000

# Запускаємо основний файл
CMD ["node", "index.js"]
