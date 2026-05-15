import { type ActionFunctionArgs, data } from "react-router";
import { isAuthenticatedAdmin } from "../lib/admin-auth.server";
import { uploadImage } from "../lib/upload.server";

export async function action({ request }: ActionFunctionArgs) {
  const authenticated = await isAuthenticatedAdmin(request);
  if (!authenticated) {
    return data({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return data({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadImage(file);
    return { url };
  } catch (error) {
    return data({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
