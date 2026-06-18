export const APP_CONFIG = {
  WEBSITE_URL:
    process.env.NODE_ENV === "production"
      ? "https://newerareality.com"
      : "http://localhost:3000",

  ADMIN_URL:
    process.env.NODE_ENV === "production"
      ? "https://admin.newerareality.com"
      : "http://localhost:3000/admin",

  API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://new-era-reality-backend.onrender.com/api"
      : "http://localhost:5000/api"),
};
