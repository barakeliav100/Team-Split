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

```
team-divider-aws/
├── interface/
│   ├── index.html
│   ├── login.html
│   └── app.js
│
├── lambdas/
│   ├── set-game.py
│   ├── set-players.py
│   ├── set-playerscount.py
│   ├── set-teamscount.py
│   ├── set-teamdevider.py
│   ├── get-teams.py
│   └── analyzeImage.py
│
├── diagrams/
│   └── architecture.png
│
├── database/
│   └── table-screenshots.png
│
└── README.md
```


## 🚀 Deployment Info

- Frontend hosted on **Amazon S3** (public bucket)
- Backend APIs deployed via **API Gateway**
- Logic processed in **Lambda** functions (Python 3.13)
- OpenAI used via API call from `set-teamdevider.py`

---

## 🔐 Security

- Cognito authentication used for user login (login.html)
- IAM roles restrict Lambda access to specific services (S3, DynamoDB)
- API Gateway is protected with token-based access from frontend


---

## 📸 Screenshots

You can find screenshots of the AWS configuration, S3 bucket, Lambda functions, API routes, and DynamoDB tables inside the `diagrams/` and `database/` folders.

---

## 📎 Notes

This project was built and deployed as part of the final assignment in an academic cloud computing course.  
Special thanks to OpenAI API and AWS Free Tier.




