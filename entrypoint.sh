#!/bin/sh
set -e



echo "Substituting NEXT_PUBLIC_* runtime env vars..."

env | grep '^NEXT_PUBLIC_' | while IFS='=' read -r key value; do
  placeholder="__${key}__"


  grep -rl "$placeholder" /app/.next 2>/dev/null | while read -r file; do
    escaped_value=$(printf '%s' "$value" | sed -e 's/[\/&|]/\\&/g')
    sed -i "s|${placeholder}|${escaped_value}|g" "$file"
  done
done

echo "Done. Starting app..."

exec "$@"