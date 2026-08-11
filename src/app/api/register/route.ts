import { consumeRegistrationQuota, createUser, UserAlreadyExistsError } from "@/lib/db";
import { isAuthConfigured } from "@/lib/auth-availability";
import { isStorageUnavailableError } from "@/lib/storage-errors";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const MAX_REGISTRATION_BODY_BYTES = 2_048;

class RequestBodyTooLargeError extends Error {}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "账号功能暂未启用" }, { status: 503 });
  }

  try {
    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_REGISTRATION_BODY_BYTES) {
      return NextResponse.json({ error: "请求内容过大" }, { status: 413, headers: { "cache-control": "no-store" } });
    }

    const identity = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")
      ?? "local";
    const quota = await consumeRegistrationQuota(identity);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "注册请求过于频繁，请稍后再试" },
        {
          status: 429,
          headers: { "retry-after": String(quota.retryAfterSeconds), "cache-control": "no-store" },
        },
      );
    }

    let payload: unknown;
    try {
      payload = await readBoundedJson(request);
    } catch (error) {
      if (error instanceof RequestBodyTooLargeError) {
        return NextResponse.json({ error: "请求内容过大" }, { status: 413, headers: { "cache-control": "no-store" } });
      }
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 });
    }

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

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUser(username, hashed);

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
    }
    if (isStorageUnavailableError(error)) {
      console.warn("Register storage unavailable:", error);
      return NextResponse.json({ error: "账号功能暂不可用" }, { status: 503 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}

async function readBoundedJson(request: Request): Promise<unknown> {
  if (!request.body) return JSON.parse("");

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedBytes += value.byteLength;
      if (receivedBytes > MAX_REGISTRATION_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The size verdict is final even if the source cannot be cancelled.
        }
        throw new RequestBodyTooLargeError();
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(body);
}
