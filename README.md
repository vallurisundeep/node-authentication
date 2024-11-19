Node Authentication App
A Node.js application with JWT-based authentication and role-based access control. This app provides features like user registration, login, token refreshing, and secure access to protected resources based on user roles.

Features
User Registration: Admins can register new users.
User Login: Generates an access token and refresh token upon successful login.
JWT Authentication: Secures endpoints with JSON Web Tokens (JWT).
Role-Based Access Control: Restricts access to specific routes based on user roles.
Token Refreshing: Allows users to refresh expired access tokens using a refresh token.
Swagger API Documentation: Provides interactive API documentation.
Technologies Used
Node.js: JavaScript runtime.
Express.js: Web framework for handling routing and middleware.
Sequelize: ORM for interacting with MySQL.
JWT: JSON Web Token for secure authentication.
bcrypt: For password hashing.
dotenv: For environment variable management.
swagger-ui-express and swagger-jsdoc: For API documentation.
Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/vallurisundeep/node-authentication.git
cd node-authentication
Install Dependencies:

bash
Copy code
npm install
Set Up Environment Variables: Create a .env file in the project root with the following variables:

env
Copy code
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=node_auth_db
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
Run Database Migrations: Set up the database using Sequelize:

bash
Copy code
npx sequelize-cli db:migrate
Start the Server:

bash
Copy code
npm run dev
API Endpoints
Authentication
Method	Endpoint	Description	Protected
POST	/api/v1/login	User login	No
POST	/api/v1/refresh	Refresh access token	No
User Management
Method	Endpoint	Description	Protected
POST	/api/v1/register	Register a new user	Admin
GET	/api/v1/profile	Get logged-in user profile	Yes
Role-Based Access Control
Admin: Can register new users and access admin routes.
User: Can access their profile and other user-specific routes.
Swagger API Documentation
Swagger is integrated for interactive API documentation.

Start the server.
Visit: http://localhost:3000/api-docs
Project Structure
bash
Copy code
node-authentication/
├── src/
│   ├── config/             # Configuration files (e.g., database, Swagger)
│   ├── controllers/        # Business logic and request handling
│   ├── middleware/         # Custom middleware (e.g., authentication, role checking)
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions (e.g., logger)
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
├── package.json            # Node dependencies and scripts
Running Tests
Run Unit Tests:
bash
Copy code
npm test
Contributing
Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Add feature-name"
Push the branch and open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.