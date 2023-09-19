import { Card, Text, Box, Flex } from '@radix-ui/themes';
import { RegisterForm } from "./form";
import Link from "next/link";

export default function Register() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card 
        variant="surface"
        style={{ maxWidth: '100%', padding: '2rem' }}
      >
        <Flex direction="column" gap="3" className="items-center">
          <Text as="div" size="2" weight="bold">
            Create your Account
          </Text>
          <RegisterForm />
          <Box>
            <p className="text-center">
              Have an account?{" "}
              <Link href="/api/auth/signin" className="text-indigo-500 hover:underline">
                Sign in
              </Link>
            </p>
          </Box>
        </Flex>
      </Card>
    </div>
  );
}





