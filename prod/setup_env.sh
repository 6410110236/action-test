#!/bin/bash
echo -e "HOST=${{ secret.HOST }}" >> .env
echo -e "PORT=${{ secret.PORT }}" >> .env

echo -e "NODE_ENV=${{ secret.NODE_ENV }}" >> .env

echo -e "APP_KEYS=${{ secret.APP_KEYS }}" >> .env
echo -e "API_TOKEN_SALT=${{ secret.API_TOKEN_SALT }}" >> .env
echo -e "ADMIN_JWT_SECRET=${{ secret.ADMIN_JWT_SECRET }}" >> .env
echo -e "TRANSFER_TOKEN_SALT=${{ secret.TRANSFER_TOKEN_SALT }}" >> .env

echo -e "DATABASE_CLIENT=${{ secret.DATABASE_CLIENT }}" >> .env
echo -e "DATABASE_HOST=${{ secret.DATABASE_HOST }}" >> .env
echo -e "DATABASE_PORT=${{ secret.DATABASE_PORT }}" >> .env
echo -e "DATABASE_NAME=${{ secret.DATABASE_NAME }}" >> .env
echo -e "DATABASE_USERNAME=${{ secret.DATABASE_USERNAME }}" >> .env
echo -e "DATABASE_PASSWORD=${{ secret.DATABASE_PASSWORD }}" >> .env
echo -e "DATABASE_SSL=${{ secret.DATABASE_SSL }}" >> .env
echo -e "DATABASE_FILENAME=${{ secret.DATABASE_FILENAME }}" >> .env
echo -e "JWT_SECRET=${{ secret.JWT_SECRET }}" >> .env
