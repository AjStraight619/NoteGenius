import { Card, Flex, Button } from "@radix-ui/themes";
import { TextField } from "@/components/ui/text-field";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { redirect } from "next/navigation";

const DOMAIN =
  process.env.NODE_ENV !== "production"
    ? "localhost:3000"
    : process.env.PRODUCTION_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY || "";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "";

const mailgun = new Mailgun(formData);

const client = mailgun.client({ username: "api", key: API_KEY });

export default function ResetPasswordPage() {
  async function resetPassword(data: FormData) {
    "use server";
    const email = data.get("email");
    if (!email || typeof email !== "string") {
      return {
        error: "Invalid email",
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        error: "User not found",
      };
    }
    const token = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
      },
    });

    const messageData = {
      from: `Password reset <security@${MAILGUN_DOMAIN}>`,
      to: user.email,
      subject: "Reset Password Request",
      text: `Hello, this email is for resetting your password, please click here: ${PROTOCOL}://${DOMAIN}/forgot-password/password-reset/${token.token}`,
    };

    await client.messages.create(MAILGUN_DOMAIN, messageData);
    redirect("/forgot-password/success");
  }
  return (
    <main className="max-w-xl px-4 mx-auto flex flex-col justify-center h-screen">
      <Card className="gap-4 flex flex-col">
        <Flex gap="4" direction="column" asChild>
          <form action={resetPassword}>
            <h1 className="text-2xl font-light">Reset password</h1>
            <p>
              Enter your email address to get instructions for resetting your
              password.
            </p>
            <TextField
              name="email"
              type="email"
              size="3"
              placeholder="Your email..."
            />
            <Button type="submit">Reset Password</Button>
            <Link
              href="/api/auth/signin"
              className="text-sm text-neutral-700/80 flex items-center"
            >
              <CaretLeftIcon />
              <span>Return to Login</span>
            </Link>
          </form>
        </Flex>
      </Card>
    </main>
  );
}
