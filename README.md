[נעזרתי בצאט GPT כדי לנסח את מסמך ה readme]
[![Watch the demo](https://img.youtube.com/vi/ICvaLcL_D50/0.jpg)](https://www.youtube.com/watch?v=ICvaLcL_D50&t=5s)
# 🛠️ ProductStore - Installation & Usage Guide

This guide explains how to set up the ProductStore project (both server and client), synchronize the database using EF Core migrations or backup SQL file, and run everything locally.

---

## ✅ Prerequisites

Make sure the following are installed on your system:

* [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/)
* [Node.js (LTS version)](https://nodejs.org/en/)
* [Angular CLI](https://angular.io/cli):

  ```bash
  npm install -g @angular/cli
  ```
* EF Core CLI tools:

  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## 📦 Backend Setup (.NET 7 Web API)

### 1. Clone the repository

```bash
git clone https://github.com/[username]/ProductStore.git
cd ProductStore/backend/ProductStoreAPI
```

### 2. Configure the database connection

Edit `appsettings.json` with your local MySQL credentials:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=productstore;User=root;Password=yourpassword;"
}
```

### 3. Restore packages & build

```bash
dotnet restore
dotnet build
```

### 4. Apply migrations OR load backup

#### Option 1: Use EF Core Migrations

```bash
dotnet ef database update --context AppDbContext
```

#### Option 2: Load SQL Backup

Use MySQL CLI or GUI tool (e.g., MySQL Workbench):

```bash
mysql -u root -p productstore < productstore_backup.sql
```

---

## 🚀 Run the Backend

```bash
dotnet run --project ProductStoreAPI.csproj
```

Server will be available at:

* HTTP: [http://localhost:5000](http://localhost:5000)
* HTTPS: [https://localhost:5001](https://localhost:5001)

---

## 🖥️ Frontend Setup (Angular)

### 1. Navigate to client folder

```bash
cd ../../client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run Angular app

```bash
ng serve
```

Frontend will be available at: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Test Admin Login

After seeding or inserting users manually, use a JWT login request with credentials (e.g., `admin`/`admin123`) to receive a token.

You can then access admin routes and features.

---

## ℹ️ Notes

* Make sure MySQL server is running locally.
* Default image is used if `imageUrl` is missing or invalid.
* Admin-only features are conditionally visible in the UI.

---

Feel free to edit the `productstore_backup.sql` or migrations based on your schema changes. Happy coding!
