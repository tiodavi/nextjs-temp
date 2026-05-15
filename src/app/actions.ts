"use server"; // 關鍵：這代表這段程式碼只在伺服器跑，不外洩密碼

import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) return;

  // 寫入資料庫
  await db.insert(customers).values({
    name,
    email,
  });

  // 告訴 Next.js：首頁資料變了，請重新整理頁面
  revalidatePath("/");
}