import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "../../lib/admin-auth.server";
import { uploadImage } from "../../lib/upload.server";

export async function POST(request: Request) {
  const authenticated = await isAuthenticatedAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
