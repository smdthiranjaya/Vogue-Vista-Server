## Student ID : COBSCCOMP4Y222P-033

![Vogue Vista Mobile App](https://github.com/smdthiranjaya/Vogue-Vista-Server/assets/37227365/4b367f9c-75d6-4f64-9525-d31e40c765fa)

### Figma All In One:
https://www.figma.com/file/ULPbKSl3hREytQvPVonPVu/Vogue-Vista-Mobile-App?type=design&node-id=48%3A225&mode=design&t=ad62VOj52rmUgqOf-1
### Figma Low Fidelity Link:
https://www.figma.com/file/ULPbKSl3hREytQvPVonPVu/Vogue-Vista-Mobile-App?type=design&node-id=1-3&mode=design
### Figma High Fidelity Link:
https://www.figma.com/file/ULPbKSl3hREytQvPVonPVu/Vogue-Vista-Mobile-App?type=design&node-id=1-4&mode=design
### Figma Prototype Link:
https://www.figma.com/file/ULPbKSl3hREytQvPVonPVu/Vogue-Vista-Mobile-App?type=design&node-id=1-5&mode=design
### Swift IOS Mobile App (Fontend) GitHub Link:
https://github.com/smdthiranjaya/Vogue-Vista
### Backend Server Repository Link:
https://github.com/smdthiranjaya/Vogue-Vista-Server
### Post Man Public Collection:
https://www.postman.com/spacecraft-cosmologist-43205865/workspace/public-ios-vogue-vista
### Video Demonstration:
https://drive.google.com/drive/folders/1lFHFPKkMToYiqMC5lxAA4oXZSdc5ngHH?usp=sharing

# Vogue Vista Backend Server

This repository contains the backend server for Vogue Vista, an innovative iOS application enhancing the online shopping experience for a fashion brand. The server is engineered using robust technologies and is designed to handle user authentication, data management, and other server-side logic efficiently.

![7](https://github.com/smdthiranjaya/Vogue-Vista-Server/assets/37227365/9d10584f-f44f-4921-8eb2-dcdfd8b8be41)
![8](https://github.com/smdthiranjaya/Vogue-Vista-Server/assets/37227365/22a3b4ab-6805-4aee-baef-972b4aeaca01)

## Introduction

In this digital era, where ease of use and effectiveness are paramount, our initiative embarked on creating an innovative iOS application for a leading-edge fashion brand. Engineered with the latest technology and a focus on user driven design philosophies, this app seeks to revolutionize the conventional shopping experience, making it fluid and delightful for fashion aficionados. By harnessing the powerful features of Heroku, PostgreSQL, and a suite of backend technologies, we have developed a platform that surpasses the expectations of modern, discerning consumers.

## Problem

Online clothing shopping often faces challenges with navigation, product search, and checkout processes, leading to customer dissatisfaction.

## Solution

An iOS application for an online clothing brand, enhancing the shopping experience with a user-friendly interface, streamlined browsing, secure user authentication, and efficient checkout flows. Hosted on Heroku, it utilizes a PostgreSQL database for robust performance.

## Key Features

Our application is built on a foundation of key features and technologies that distinguish it in the digital marketplace:
- Heroku and GitHub Integration: Utilizing Heroku for hosting our backend Node.js server and integrating with GitHub for continuous deployment allows for streamlined development and deployment processes.
- Heroku PostgreSQL Database: The use of Heroku PostgreSQL offers a reliable and scalable database solution, ensuring efficient data management throughout the application.
- Robust Backend Technologies: Incorporating Express for server-side logic, pg pool for database interaction, bcrypt for secure password handling, and JSON Web Tokens for authentication, we’ve established a secure and efficient backend structure.
- Postman and Sourcetree Utilization: Leveraging Postman for API testing and Sourcetree for version control, our development process is both efficient and manageable.
- Postico 2 for Database Management: Employing Postico 2 provides a user-friendly interface for database management, enhancing our data handling capabilities.

## App Flow

![Modern App Portfolio Mockup Presentation](https://github.com/smdthiranjaya/Vogue-Vista-Server/assets/37227365/d6c7cde4-3825-482e-99b4-bf6a4ebc69e6)
![Modern App Portfolio Mockup Presentation (1)](https://github.com/smdthiranjaya/Vogue-Vista-Server/assets/37227365/e56c8e05-1e2b-4a2e-b96d-f717ccee526f)

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
