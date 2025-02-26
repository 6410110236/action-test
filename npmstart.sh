#!/bin/bash
cd backend
npm run develop &

sleep 3

cd ../frontend
npm install
npm start
