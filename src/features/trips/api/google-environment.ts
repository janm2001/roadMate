export function getGoogleServerApiKey(): string | null {
  return process.env.GOOGLE_MAPS_SERVER_API_KEY?.trim() || null;
}

export function getGoogleBrowserApiKey(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_API_KEY?.trim() || null;
}
