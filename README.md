# Assignment 3 - COSC360 / COSC560 (Frontend)

GitHub Repo: https://github.com/RamPrasai/assessment3-frontend
Backend (A2) Repo: https://github.com/RamPrasai/assessment2

This is a **React (Vite + TypeScript)** frontend for Assignment 3.
It talks to the Laravel API from Assignment 2 using **Bearer tokens (Sanctum)** and provides CRUD for posts.

---

## Setup

1) Go to the project
cd C:\xampp\htdocs\assessment3-frontend


2) Set API base URL (points to your A2 Laravel server)
Create a `.env` with:
VITE_API_URL=http://127.0.0.1:8000


3) Install & run
npm install
npm run dev

Open the app at: `http://localhost:5173`



## Token (from Backend A2)

Create a user & token in your A2 project:

cd C:\xampp\htdocs\assessment2
php artisan tinker


use App\Models\User; use Illuminate\Support\Facades\Hash;
$u = User::updateOrCreate(
  ['email'=>'dev@example.com'],
  ['name'=>'Dev','password'=>Hash::make('password')]
);
$token = $u->createToken('a3-token')->plainTextToken; $token;


Copy the token in the frontend, paste it into the "Paste API token"box (top-right)  **Save Token**   refresh.


Run the API if not already:
php artisan serve --host=127.0.0.1 --port=8000



## Routes

/ list posts      (View / Edit / Delete)
/post/create      create a post
/post/edit/:id    edit a post
/post/:id         view a post


## Notes

- Frontend sends **both** `content` and `body` to match the backend column.
- If you change backend port, update `.env` and restart `npm run dev`.
- If you hit CORS, allow `http://localhost:5173` in `assessment2/config/cors.php` and run `php artisan config:clear`.
