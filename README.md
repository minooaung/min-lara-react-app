## Setup the Laravel and React project of Min Oo Aung

The project has backend and frontend dependencies to start the local development.
Please follow the steps below.

1. Install the dependencies for backend

- Go to backend folder 
```bash
cd backend 
```

- Install dependencies
```bash
composer install
``` 

- Run DB migration
```bash
php artisan migrate
```

- Generate Database seeder
```bash
php artisan db:seed
```

- Running Backend Server
```bash
php artisan serve
```

2. Installing dependencies for frontend

- Go to frontend folder 
```bash
cd frontend 
``` 

- Install dependencies
```bash
npm install
```

- Running Front End
```bash
npm run dev
```