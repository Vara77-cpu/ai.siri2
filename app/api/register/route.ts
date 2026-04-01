import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const filePath = path.join(process.cwd(), "data", "users.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "User registered successfully" });

  } catch (error) {
    return NextResponse.json({ message: "Register error" });
  }
}