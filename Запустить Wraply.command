#!/bin/zsh
cd -- "${0:A:h}" || exit 1
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

address=http://127.0.0.1:5378/
if curl --noproxy '*' --silent --fail --max-time 2 "$address" -o /dev/null; then
  open "$address"
  exit 0
fi

echo "Wraply будет доступен по адресу $address"
echo "Оставьте это окно открытым. Для остановки нажмите Ctrl+C."
exec npm run dev
