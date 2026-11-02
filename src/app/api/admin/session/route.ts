import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionCookie, SESSION_COOKIE } from "@/lib/firebase/auth";

const requestSchema = z.object({ idToken: z.string().min(1).max(5000) });

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const session = await createSessionCookie(body.idToken);
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to establish admin session.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
