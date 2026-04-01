**Food Ordering System**
==============================

**1\. Overview**
----------------

-   [**[[Introduction]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Introduction): A brief overview of the Food Ordering System, its purpose, and key features.

-   [**[[Project Goals]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Project_Goals): Detailed explanation of the project's objectives and what it aims to achieve.

-   [**[[System Architecture]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/System_Architecture): High-level overview of the system's architecture, including backend, frontend, and database.

* * * * *

**2\. Research**
----------------

-   **Review of Existing Solutions (Backend Focus)**:

    -   [**[[Yandex Eats]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Yandex_Eats): Analysis of Yandex Eats' backend architecture and features.

    -   [**[[SkipTheDishes]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/SkipTheDishes): Insights into SkipTheDishes' backend design and performance.

-   **Backend Technologies Selection**:

    -   [**[[.NET]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/NET): Why .NET was chosen for the backend.

    -   [**[[Node.js]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Nodejs): Comparison with Node.js and why it wasn't selected.

    -   [**[[SQL Server (SSMS)]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/SQL_Server_(SSMS)): Reasons for choosing SSMSas the database

-   Diagrams

    -   [[[Class Diagram]]](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Class_Diagram)

    -   [[[Used Case Diagram]]](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Used_Case_Diagram)

    -   [[[System architture Diagram]]](https://science.pm.kreosoft.space/projects/amr-2024/wiki/System_architture_Diagram)

* * * * *

**3\. Design**
--------------

-   **Functional Requirements**:

    -   [**[[User Management]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/User_Management): Explanation of user registration, login, profile management, and role-based access control.

    -   [**[[Basket Management]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Basket_Management): How users can add, remove, and manage items in their basket.

    -   [**[[Dish Management]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Dish_Management): How dishes are categorized, displayed, and filtered.

    -   [**[[Order Management]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Order_Management): The process of placing, tracking, and confirming orders.

    -   [**[[Rating Management]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Rating_Management): How users can rate dishes and how ratings are calculated.

-   **Non-Functional Requirements**:

    -   [**[[Performance]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Performance): Expected system performance and scalability.

    -   [**[[Security]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Security): Measures taken to secure user data and transactions.

    -   [**[[Usability]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Usability): User experience considerations.

* * * * *

**4\. Implementation**
----------------------

-   **Restaurant Application Design and Implementation**:

    -   [**[[Backend Design]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Backend_Design): Detailed explanation of the backend design, including controllers, services, and repositories.

-   **Authentication and Authorization of Users**:

    -   [**[[JWT (JSON Web Tokens)]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/JWT_(JSON_Web_Tokens)): How JWT is used for authentication and authorization.

    -   [**[[Role-Based Access Control]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Role-Based_Access_Control): Explanation of how roles (User, Admin) are managed.

-   **Database using Entity Framework Core**:

    -   [**[[Database Schema]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Database_Schema): Detailed schema of the database, including tables and relationships.

    -   [**[[Entity Framework Core]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Entity_Framework_Core): How EF Core is used for database operations.

-   **Error Handling**:

    -   [**[[Global Error Handling]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Global_Error_Handling): How errors are handled globally in the application.

    -   [**[[Custom Error Responses]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Custom_Error_Responses): Explanation of custom error responses and their structure.

-   **Using Asynchronous Code**:

    -   [**[[Benefits of Asynchronous Programming]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Benefits_of_Asynchronous_Programming): Why async/await is used in the project.

    -   [**[[Implementation]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Implementation): Examples of asynchronous code in the project.

-   **Used Tech Stack**:

    -   [**.NET Core**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/NET): Detailed explanation of .NET Core and its features.

    -   [**SQL Server (SSMS)**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/SQL_Server_(SSMS)): Why SSMS was chosen and its advantages.

    -   [**[[AutoMapper]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/AutoMapper): How AutoMapper is used for object mapping.

    -   [**[[Swagger]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/Swagger): How Swagger is used for API documentation.

* * * * *

**5\. Codebase Documentation**
------------------------------

-   **Controllers**:

    -   [**[[BasketController]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/BasketController): Explanation of the basket-related endpoints and their functionality.

    -   [**[[DishController]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/DishController): Explanation of the dish-related endpoints and their functionality.

    -   [**[[OrderController]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/UsersController): Explanation of the order-related endpoints and their functionality.

    -   **[[UsersController]]**: Explanation of the user-related endpoints and their functionality.

-   **Services**:

    -   [**[[BasketService]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/BasketService): Explanation of the basket service and its methods.

    -   [**[[DishService]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/DishService): Explanation of the dish service and its methods.

    -   [**[[OrderService]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/OrderService): Explanation of the order service and its methods.

    -   [**[[RateService]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/RateService): Explanation of the rate service and its methods.

    -   [**[[UserService]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/UserService): Explanation of the user service and its methods.

    -   [**[[BlacklistService]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/BlacklistService): Explanation of the blacklist service and its role in token management.

-   **Repositories**:

    -   [**[[BasketRepository]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/BasketRepository): Explanation of the basket repository and its methods.

    -   [**[[DishRepository]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/DishRepository): Explanation of the dish repository and its methods.

    -   [**[[OrderRepository]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/OrderRepository): Explanation of the order repository and its methods.

    -   [**[[RateRepository]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/RateRepository): Explanation of the rate repository and its methods.

    -   [**[[UserRepository]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/UserRepository): Explanation of the user repository and its methods.

-   **Middleware**:

    -   [**[[ErrorHandlingMiddleware]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/ErrorHandlingMiddleware): Explanation of the global error handling middleware.

    -   [**JwtMiddleware**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/JWT_(JSON_Web_Tokens)): Explanation of the JWT middleware and its role in token validation.

-   **DTOs (Data Transfer Objects)**:

    -   [**[[BasketDto]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/BasketDto): Explanation of the basket DTO and its fields.

    -   [**[[DishDto]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/DishDto): Explanation of the dish DTO and its fields.

    -   [**[[OrderDto]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/OrderDto): Explanation of the order DTO and its fields.

    -   [**[[UserProfileDto]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/UserProfileDto): Explanation of the user profile DTO and its fields.

-   **Pagination**:

    -   [**[[PagedResult]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/PagedResult): Explanation of the pagination implementation and how it works.

-   **Custom Error Schema**:

    -   [**[[CustomErrorSchema]]**](https://science.pm.kreosoft.space/projects/amr-2024/wiki/CustomErrorSchema): Explanation of the custom error schema and its usage.
