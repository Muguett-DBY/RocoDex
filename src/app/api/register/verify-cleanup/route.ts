import { isAuthConfigured } from "@/lib/auth-availability";
import { deleteUserByUsername, findUserByUsername } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const LIVE_REGISTRATION_USERNAME_PATTERN = /^qa-[a-z0-9]{6,12}-[a-z0-9]{4}$/;
const CLEANUP_CONFIRMATION = "delete-live-registration-user";

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
    const { username, password, confirm } = payload as {
      username?: unknown;
      password?: unknown;
      confirm?: unknown;
    };

    if (typeof username !== "string" || typeof password !== "string" || typeof confirm !== "string") {
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
    }

    if (confirm !== CLEANUP_CONFIRMATION || !LIVE_REGISTRATION_USERNAME_PATTERN.test(username)) {
      return NextResponse.json({ error: "只能清理自动验收账号" }, { status: 400 });
    }

    const user = await findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "验收账号校验失败" }, { status: 403 });
    }

    const deleted = await deleteUserByUsername(username);

    if (!deleted) {
      return NextResponse.json({ error: "验收账号清理失败" }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      deleted: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Live registration cleanup error:", error);
    return NextResponse.json({ error: "验收账号清理失败" }, { status: 500 });
  }
}
