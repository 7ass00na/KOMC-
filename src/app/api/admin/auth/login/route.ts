import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { readEntity, writeEntity, makeId } from "@/lib/store";

type User = {
  id: string;
  username?: string;
  email?: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
  password_hash: string;
};

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.identifier || !body.password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }
    const identifier = String(body.identifier).trim();
    const password = String(body.password);
    let users = (await readEntity<User[]>("users", [])) as User[];

    // Ensure default admin exists or updated to requested credentials
    const desiredUsername = "Komc@admin";
    const desiredPasswordHash = sha("Admin@2626");
    if (!users.length) {
      users = [
        {
          id: makeId("u_"),
          username: desiredUsername,
          email: desiredUsername,
          role: "admin",
          active: true,
          password_hash: desiredPasswordHash,
        },
      ];
      await writeEntity("users", users);
    } else {
      const idx = users.findIndex(
        (u) =>
          (u.username && u.username.toLowerCase() === desiredUsername.toLowerCase()) ||
          (u.email && u.email.toLowerCase() === desiredUsername.toLowerCase())
      );
      if (idx === -1) {
        users.push({
          id: makeId("u_"),
          username: desiredUsername,
          email: desiredUsername,
          role: "admin",
          active: true,
          password_hash: desiredPasswordHash,
        });
        await writeEntity("users", users);
      } else {
        const current = users[idx];
        const needsUpdate =
          current.username !== desiredUsername ||
          current.email !== desiredUsername ||
          current.role !== "admin" ||
          !current.active ||
          current.password_hash !== desiredPasswordHash;
        if (needsUpdate) {
          users[idx] = {
            ...current,
            username: desiredUsername,
            email: desiredUsername,
            role: "admin",
            active: true,
            password_hash: desiredPasswordHash,
          };
          await writeEntity("users", users);
        }
      }
    }

    const identLower = identifier.toLowerCase();
    const user = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === identLower) ||
        (u.email && u.email.toLowerCase() === identLower)
    );
    if (!user || !user.active || user.password_hash !== sha(password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role: user.role } }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Auth failed" }, { status: 500 });
  }
}
