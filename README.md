![Vogue Vista Mobile App](https://github.com/smdthiranjaya/Vogue-Vista-Server/assets/37227365/4b367f9c-75d6-4f64-9525-d31e40c765fa)

## Student ID : COBSCCOMP4Y222P-033

### Swift IOS Mobile App (Fontend) GitHub Link:
https://github.com/smdthiranjaya/Vogue-Vista.git

### Post Man API Public Collection Link:
https://www.postman.com/spacecraft-cosmologist-43205865/workspace/public-ios-vogue-vista


# Vogue Vista Backend Server

## Introduction

This repository contains the backend server for Vogue Vista, an innovative iOS application enhancing the online shopping experience for a fashion brand. The server is engineered using robust technologies and is designed to handle user authentication, data management, and other server-side logic efficiently.

## Technologies

- **Node.js/Express**: For building the server-side logic.
- **Heroku**: For hosting the backend services.
- **PostgreSQL**: Managed by Heroku for database services.
- **bcrypt**: For secure password hashing.
- **JSON Web Tokens (JWT)**: For handling secure user authentication.
- **pg pool**: For managing PostgreSQL connections.
- **Postman**: Used for API testing.
- **Sourcetree**: Used for version control.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/smdthiranjaya/Vogue-Vista-Server.git
   cd Vogue-Vista-Server
2. **Install dependencies**:
   ```bash
   npm install
3. **Environment Setup**:
Create a .env file in the root directory and populate it with the necessary environment variables:
   ```bash
   DATABASE_URL=your_database_url_here
   JWT_SECRET=your_jwt_secret_here

4. **Start the server**:
   ```bash
   npm start

## Testing

Ensure that you have Postman installed to run the API tests. Import the provided Postman collection to test the various endpoints.


## Deployment

The app is configured for deployment on Heroku. Follow the standard Heroku deployment process via Git:
```bash
git add .
git commit -m "Prepare for deployment"
git push heroku master
