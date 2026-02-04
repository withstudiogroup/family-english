import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 인증이 필요한 경로들
    "/dashboard/:path*",
    "/chat/:path*",
    "/scenarios/:path*",
    "/level/:path*",
    "/profile/:path*",
    "/history/:path*",
  ],
};
