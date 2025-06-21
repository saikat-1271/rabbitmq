#  Order Processing System (NestJS + RabbitMQ + PostgreSQL)

This system syncs stock from external vendors and processes customer orders with queue-based workers.

---

##  Setup Instructions

###  Dependencies
- Node.js
- PostgreSQL
- RabbitMQ

###  Env Setup
Create a `.env` file:

###  Start server
- npm install
- start RabbitMQ service in localhost
- npm run start:dev ( to run the server)
- npm run start:worker ( to run the worker in a different terminal)




```env
PG_HOST='ep-weathered-salad-a4mqezx3.us-east-1.aws.neon.tech'
PG_DATABASE='neondb'
PG_USER='neondb_owner'
PG_DATABASE='npg_P6EmjgNnkZe3'

