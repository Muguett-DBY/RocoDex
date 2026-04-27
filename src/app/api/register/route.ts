import { createUser, findUserByUsername } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
    }

    if (username.length < 2 || username.length > 20) {
      return NextResponse.json({ error: "用户名需 2-20 个字符" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少 6 位" }, { status: 400 });
    }

    const existing = findUserByUsername(username);

    if (existing) {
      return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = createUser(username, hashed);

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch {
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
