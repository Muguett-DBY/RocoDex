import { createUser, findUserByUsername } from "@/lib/db";
import { isAuthConfigured } from "@/lib/auth-availability";
import { isStorageUnavailableError } from "@/lib/storage-errors";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "账号功能暂未启用" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
  }

  try {
    const { username, password } = payload as { username?: unknown; password?: unknown };

    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
    }

    if (username.length < 2 || username.length > 20) {
      return NextResponse.json({ error: "用户名需 2-20 个字符" }, { status: 400 });
    }

    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: "密码需 6-128 位" }, { status: 400 });
    }

    const existing = await findUserByUsername(username);

    if (existing) {
      return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUser(username, hashed);

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Register error:", error);
    if (isStorageUnavailableError(error)) {
      return NextResponse.json({ error: "账号功能暂不可用" }, { status: 503 });
    }
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
