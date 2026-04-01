import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

  try {

    const { email, password } = await req.json();

    const filePath = path.join(process.cwd(), "data", "users.json");

    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ message: "Invalid email" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ message: "Invalid password" });
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch {

    return NextResponse.json({ message: "Login error" });

  }

}