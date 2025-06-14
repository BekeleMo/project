# Inventory Management System - Backend

A comprehensive Spring Boot backend application for inventory management with PostgreSQL database.

## Features

- **User Management**: Role-based access control (Admin, Manager, Staff)
- **Product Management**: Complete CRUD operations with stock tracking
- **Customer Management**: Customer profiles and order history
- **Sales Management**: Sales processing and tracking
- **Stock Movement**: Inventory movement tracking and reporting
- **Notifications**: System notifications and alerts
- **Reports**: Sales and inventory analytics
- **Security**: JWT-based authentication and authorization
- **API Documentation**: Swagger/OpenAPI integration

## Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Database Migration**: Liquibase
- **Mapping**: MapStruct
- **Build Tool**: Maven
- **Java Version**: 17

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH PASSWORD 'inventory_pass';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
```

### 2. Environment Variables

Set the following environment variables (optional, defaults provided):

```bash
export DB_USERNAME=inventory_user
export DB_PASSWORD=inventory_pass
export JWT_SECRET=mySecretKey123456789012345678901234567890
```

### 3. Build and Run

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Build the application
mvn clean compile

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

### 4. Database Migration

Liquibase will automatically run database migrations on startup. The migrations include:
- Creating all necessary tables
- Setting up indexes and constraints
- Inserting default data (admin user, sample products, customers)

## Default Credentials

- **Email**: admin@inventoryms.com
- **Password**: password

## API Documentation

Once the application is running, you can access:
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## Project Structure

```
src/main/java/com/inventoryms/
├── config/              # Configuration classes
├── controller/          # REST controllers
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs
│   └── response/        # Response DTOs
├── entity/              # JPA entities
├── enums/               # Enumerations
├── exception/           # Custom exceptions
├── mapper/              # MapStruct mappers
├── repository/          # JPA repositories
├── security/            # Security configuration
└── service/             # Business logic services
    └── impl/            # Service implementations

src/main/resources/
├── db/changelog/        # Liquibase migration files
└── application.yml      # Application configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users` - Get all users (Admin/Manager)
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin)
- `GET /api/users/me` - Get current user

### Product Management
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin/Manager)
- `PUT /api/products/{id}` - Update product (Admin/Manager)
- `DELETE /api/products/{id}` - Delete product (Admin)
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/categories` - Get all categories
- `PATCH /api/products/{id}/stock` - Update product stock

### Customer Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Sales Management
- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create sale
- `PUT /api/sales/{id}` - Update sale
- `DELETE /api/sales/{id}` - Delete sale

### Stock Movement
- `GET /api/stock-movements` - Get all stock movements
- `GET /api/stock-movements/{id}` - Get stock movement by ID
- `POST /api/stock-movements` - Create stock movement

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `POST /api/notifications` - Create notification

## Security

The application uses JWT-based authentication with role-based access control:

- **ADMIN**: Full access to all resources
- **MANAGER**: Access to products, inventory, sales, customers, and reports
- **STAFF**: Limited access to sales and customers

## Error Handling

The application includes comprehensive error handling with appropriate HTTP status codes:
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server errors

## Testing

Run tests with:

```bash
mvn test
```

## Production Deployment

For production deployment:

1. Update `application.yml` with production database settings
2. Set secure JWT secret key
3. Configure proper CORS settings
4. Enable HTTPS
5. Set up proper logging configuration
6. Configure monitoring and health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.