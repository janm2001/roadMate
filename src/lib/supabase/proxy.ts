import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnvironment } from "./env";

const authRoutes = new Set(["/login", "/signup"]);
const publicRoutes = new Set(["/privacy", "/terms"]);

function redirectWithSession(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirectResponse = NextResponse.redirect(url);

  response.headers.forEach((value, key) => {
    redirectResponse.headers.set(key, value);
  });
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { publishableKey, url } = getSupabaseEnvironment();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);
  const isAuthRoute = authRoutes.has(request.nextUrl.pathname);
  const isPublicRoute = publicRoutes.has(request.nextUrl.pathname);

  if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
    return redirectWithSession(request, response, "/login");
  }

  if (isAuthenticated && isAuthRoute) {
    return redirectWithSession(request, response, "/");
  }

  return response;
}
