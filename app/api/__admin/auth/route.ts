import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from "../../../lib/admin-auth.server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(async () => {
      const body = await request.json().catch(() => ({}));
      const fd = new FormData();
      Object.entries(body).forEach(([k, v]) => fd.append(k, String(v)));
      return fd;
    });

    const intent = String(formData.get("intent") ?? "");

    if (intent === "logout") {
      await clearAdminSessionCookie();
      return NextResponse.json({ success: "Logged out successfully" });
    }

    if (intent === "login") {
      const username = String(formData.get("username") ?? "");
      const password = String(formData.get("password") ?? "");

      const isValid = await verifyAdminCredentials(username, password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
      }

      await setAdminSessionCookie();
      return NextResponse.json({ success: "Logged in successfully" });
    }

    return NextResponse.json({ error: "Unknown auth intent" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 },
    );
  }
}
