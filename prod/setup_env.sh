# #!/bin/bash
echo -e "HOST=${{ secrets.HOST }}" >> .env
echo -e "PORT=${{ secrets.PORT }}" >> .env

echo -e "NODE_ENV=${{ secrets.NODE_ENV }}" >> .env

echo -e "APP_KEYS=${{ secrets.APP_KEYS }}" >> .env
echo -e "API_TOKEN_SALT=${{ secrets.API_TOKEN_SALT }}" >> .env
echo -e "ADMIN_JWT_SECRET=${{ secrets.ADMIN_JWT_SECRET }}" >> .env
echo -e "TRANSFER_TOKEN_SALT=${{ secrets.TRANSFER_TOKEN_SALT }}" >> .env

echo -e "DATABASE_CLIENT=${{ secrets.DATABASE_CLIENT }}" >> .env
echo -e "DATABASE_HOST=${{ secrets.DATABASE_HOST }}" >> .env
echo -e "DATABASE_PORT=${{ secrets.DATABASE_PORT }}" >> .env
echo -e "DATABASE_NAME=${{ secrets.DATABASE_NAME }}" >> .env
echo -e "DATABASE_USERNAME=${{ secrets.DATABASE_USERNAME }}" >> .env
echo -e "DATABASE_PASSWORD=${{ secrets.DATABASE_PASSWORD }}" >> .env
echo -e "DATABASE_SSL=${{ secrets.DATABASE_SSL }}" >> .env
echo -e "DATABASE_FILENAME=${{ secrets.DATABASE_FILENAME }}" >> .env
echo -e "JWT_SECRET=${{ secrets.JWT_SECRET }}" >> .env
