import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { contactSubmissionSchema } from "@/types/content";

export async function POST(request: Request) {
  try {
    const submission = contactSubmissionSchema.parse(await request.json());
    await getAdminDb().collection("contactSubmissions").add({
      ...submission,
      read: false,
      createdAt: Date.now(),
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Please check your contact details and try again." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to save your message right now." }, { status: 503 });
  }
}
