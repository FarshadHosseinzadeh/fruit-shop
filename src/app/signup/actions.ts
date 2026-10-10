"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "نام حداقل ۲ حرف باشد"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد"),
});

export type SignupState = { error?: string };

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, phone, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { phone } });
  if (exists) {
    return { error: "این شماره قبلاً ثبت‌نام کرده است" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, phone, passwordHash } });

  redirect("/login");
}
