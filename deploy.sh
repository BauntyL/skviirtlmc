#!/bin/bash

# Скрипт автоматического развертывания на VPS
# Использование: ./deploy.sh

set -e  # Остановка при ошибке

VPS_HOST="root@skviirtl-server.ru"
VPS_PATH="/var/www/skviirtl-site"
BACKUP_NAME="skviirtl-site.backup.$(date +%Y%m%d_%H%M%S)"

echo "=== Развертывание обновлений на VPS ==="
echo ""

# Проверка наличия dist
if [ ! -d "dist" ]; then
    echo "❌ Папка dist не найдена. Запустите: npm run build"
    exit 1
fi

echo "✓ Папка dist найдена"
echo ""

# Создание резервной копии на VPS
echo "📦 Создание резервной копии на VPS..."
ssh $VPS_HOST "cp -r $VPS_PATH /var/www/$BACKUP_NAME"
echo "✓ Резервная копия создана: /var/www/$BACKUP_NAME"
echo ""

# Остановка сервера
echo "⏸️  Остановка сервера..."
ssh $VPS_HOST "cd $VPS_PATH && pm2 stop skviirtl-site"
echo "✓ Сервер остановлен"
echo ""

# Загрузка файлов
echo "📤 Загрузка обновленных файлов..."
rsync -avz --progress dist/ $VPS_HOST:$VPS_PATH/dist/
rsync -avz --progress server/ $VPS_HOST:$VPS_PATH/server/
echo "✓ Файлы загружены"
echo ""

# Запуск сервера
echo "▶️  Запуск сервера..."
ssh $VPS_HOST "cd $VPS_PATH && pm2 start skviirtl-site && pm2 save"
echo "✓ Сервер запущен"
echo ""

# Проверка статуса
echo "📊 Статус сервера:"
ssh $VPS_HOST "pm2 status skviirtl-site"
echo ""

echo "✅ Развертывание завершено!"
echo ""
echo "Для просмотра логов выполните:"
echo "  ssh $VPS_HOST 'pm2 logs skviirtl-site'"
echo ""
echo "Для отката к резервной копии выполните:"
echo "  ssh $VPS_HOST 'pm2 stop skviirtl-site && rm -rf $VPS_PATH && cp -r /var/www/$BACKUP_NAME $VPS_PATH && pm2 start skviirtl-site'"
