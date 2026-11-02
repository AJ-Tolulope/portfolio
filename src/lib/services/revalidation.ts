import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateContent(paths: string[]) {
  for (const path of paths) revalidatePath(path);
  revalidateTag("content", "max");
}
