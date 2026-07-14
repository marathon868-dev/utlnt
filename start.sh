#!/bin/bash

# Устанавливаем зависимости
cd backend
npm install
cd ..

# Собираем фронтенд
cd frontend
npm install
npm run build
cd ..

# Запускаем бекенд
cd backend
npm start