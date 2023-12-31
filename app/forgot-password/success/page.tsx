import Link from "next/link";
import { Card, Flex, Button } from "@radix-ui/themes";

export default async function SuccessPage() {
  return (
    <main className="max-w-xl px-4 mx-auto flex flex-col justify-center h-screen">
      <Card className="gap-4 flex flex-col">
        <Flex gap="4" direction="column">
          <h1 className="text-2xl font-light">Password Reset</h1>
          <p>If the email does not show up, check your spam folder.</p>
          <Button type="submit" asChild>
            <Link href="/">Return to Login</Link>
          </Button>
        </Flex>
      </Card>
    </main>
  );
}
