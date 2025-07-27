⚽ GroupMatch – AWS-Based Team Allocation System
Final project for the AWS Cloud Computing course:
A cloud-based system for managing amateur sports games, including player registration and automated team division.

This project simulates an MVP (Minimum Viable Product) for a sports team organizer platform, supporting full data collection, validation, and AI-powered team assignment – all built entirely on AWS services.

🧩 Architecture
The system is fully serverless and leverages core AWS components:

Amazon Cognito – authenticates users and provides secure access via JWT

Amazon API Gateway – routes frontend requests to backend logic

AWS Lambda – handles logic for game creation, player management, and AI-based team division

Amazon S3 – hosts the static web interface (HTML/CSS/JS)

Amazon DynamoDB – stores structured data: games, players, teams

IAM (Identity and Access Management) – manages permissions for secure Lambda–DynamoDB interactions

💻 Features
🗓️ Create a new game with date and time

👥 Define number of players (with validation: 4–33)

🧩 Choose number of teams with fair division logic

🧍‍♂️ Add players including:

Name

Role (goalkeeper, defender, midfielder, striker)

Rating (1–10, 0.5 steps)

🚫 Prevent duplicates and excess goalkeepers

💾 Save all players to DynamoDB (with game_id and player_id)

🧠 AI-powered team division using GPT-4o based Lambda

Enforces one goalkeeper per team

Balances average rating and roles

📊 Final team display with full breakdown, including stats

🌐 Live Interface
A static web interface is hosted on Amazon S3, connected directly to secured RESTful endpoints via API Gateway and Lambda functions.

Frontend stack:

HTML / CSS / JavaScript (Vanilla)

Cognito for secure sign-in

Dynamic DOM rendering for forms and tables

📂 Project Structure
pgsql
Copy
Edit
project_root/
├── interface/
│   ├── index.html
│   └── app.js
│
├── lambdas/
│   ├── set-game
│   ├── set-playerscount
│   ├── set-teamscount
│   ├── set-players
│   └── set-teamdevider
│
├── diagrams/
│   └── architecture-diagram.png
│
└── database/
    ├── games (DynamoDB table)
    ├── players_new (DynamoDB table)
    └── teams (DynamoDB table)
🧠 Logic Flow
User logs in via Cognito

Fills game details → sent via API Gateway

Lambda creates a new game ID

Players are added to frontend memory

On save: players are pushed to DynamoDB

On division: Lambda with GPT-4o assigns teams

Results are displayed live on-screen
