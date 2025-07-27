# ⚽ Team Divider – AWS Based System

Final project for the AWS Cloud Computing course:  
A cloud-based web system for creating games, registering players, and dividing them into balanced teams using OpenAI.

This project simulates a Minimum Viable Product (MVP) designed for managing sports games among amateur players, fully serverless and deployed via AWS services.

---

## 🧩 Architecture Overview

The system is built entirely on AWS:

- **Amazon API Gateway** – exposes HTTP endpoints to receive game and player data
- **AWS Lambda** – contains logic for saving games, players, and computing team division using GPT
- **Amazon DynamoDB** – stores data for games, players, and teams
- **Amazon S3** – hosts the frontend (HTML/JS/CSS)
- **IAM** – securely grants permissions between services

![Architecture Diagram](diagrams/architecture.png)

---

## 💻 Features

- 📝 Create a new game (date, time, and creator)
- 🎮 Set number of players and number of teams
- 🧍‍♂️ Add players with name, position, and skill rating
- 🧠 Use AI (OpenAI GPT-4o) to divide players into balanced teams
- 📊 Store results in DynamoDB for later retrieval
- 🌐 Modern and responsive frontend with inline editing

---

## 📂 Project Structure


