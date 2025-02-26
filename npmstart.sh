#!/bin/bash
cd backend
npm install
npm run develop &

sleep 3

cd ../frontend
npm install
npm start
