# Инструкция по развертыванию обновлений

## Что было исправлено

1. Добавлено детальное логирование для отладки ошибок синхронизации
2. Добавлена обработка ошибок для каждой секции синхронизации (статистика сервера, игроки, кланы)
3. Добавлены проверки типов для предотвращения ошибок при обработке данных кланов
4. Улучшена обработка ошибок с выводом подробной информации в логи

## Шаги для развертывания на VPS

### 1. Сборка проекта локально

```bash
cd AAAsite/SkviirtlServerSite
npm run build
```

### 2. Создание архива для развертывания

```bash
# Создаем архив с необходимыми файлами
zip -r skviirtl_vps_package.zip \
  dist/ \
  node_modules/ \
  package.json \
  package-lock.json \
  ecosystem.config.cjs \
  .env
```

### 3. Загрузка на VPS

```bash
# Подключаемся к VPS
ssh root@skviirtl-server.ru

# Останавливаем текущий процесс
cd /var/www/skviirtl-site
pm2 stop skviirtl-site

# Создаем резервную копию
cp -r /var/www/skviirtl-site /var/www/skviirtl-site.backup.$(date +%Y%m%d_%H%M%S)

# Загружаем новый архив (с локальной машины)
# scp skviirtl_vps_package.zip root@skviirtl-server.ru:/var/www/

# Распаковываем
cd /var/www/skviirtl-site
unzip -o /var/www/skviirtl_vps_package.zip

# Устанавливаем зависимости (если нужно)
npm install --production

# Запускаем сервер
pm2 start ecosystem.config.cjs
pm2 save
```

### 4. Проверка логов

```bash
# Смотрим логи в реальном времени
pm2 logs skviirtl-site

# Или последние 100 строк
pm2 logs skviirtl-site --lines 100
```

### 5. Тестирование API

```bash
# Локально (из папки проекта)
chmod +x test-sync.sh
./test-sync.sh

# Или вручную через curl
curl -X POST "https://skviirtl-server.ru/api/sync?secret=skviirtl_secret_key_123&action=sync" \
  -H "Content-Type: application/json" \
  -d '{"secret":"skviirtl_secret_key_123","onlineCount":1,"maxPlayers":100,"tps":"20.0","players":[],"clans":[]}'
```

## Что искать в логах

После развертывания проверьте логи на наличие следующих сообщений:

### Успешная синхронизация:
```
[PLUGIN] Request received: { method: 'POST', url: '/api/sync?...', hasBody: true, ... }
[PLUGIN] Action: sync
[PLUGIN] Sync completed successfully
POST /api/sync 200 in XXXms
```

### Ошибки:
```
[PLUGIN] Handler error: ...
[PLUGIN] Error stack: ...
[PLUGIN] Error updating server stats: ...
[PLUGIN] Error updating players: ...
[PLUGIN] Error updating clans: ...
```

## Откат изменений

Если что-то пошло не так:

```bash
# Останавливаем текущий процесс
pm2 stop skviirtl-site

# Восстанавливаем из резервной копии
rm -rf /var/www/skviirtl-site
cp -r /var/www/skviirtl-site.backup.YYYYMMDD_HHMMSS /var/www/skviirtl-site

# Запускаем
cd /var/www/skviirtl-site
pm2 start ecosystem.config.cjs
```

## Проверка работы плагина

После развертывания проверьте логи Minecraft сервера:

```
# Должны увидеть успешную синхронизацию
[SkviirtlWebConnector] Successfully synced data to website. Code: 200
```

Если видите ошибки 500, проверьте логи Node.js сервера через `pm2 logs`.
