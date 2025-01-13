export const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export const TOKEN = process.env.EXPO_PUBLIC_TOKEN;

if (!API_KEY || !TOKEN) {
  throw new Error(
    "Missing required environment variables. Please check your .env file."
  );
}
