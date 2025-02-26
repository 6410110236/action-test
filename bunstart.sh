#!/bin/bash

cd backend
bun run develop &

sleep 3

cd ../frontend
bun install
bun start