export const API_KEY = process.env.API_KEY;

export const TOKEN = process.env.TOKEN;

if (!API_KEY || !TOKEN) {
  throw new Error(
    "Missing required environment variables. Please check your .env file."
  );
}
