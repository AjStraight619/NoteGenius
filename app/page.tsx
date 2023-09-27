import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  LogOutButton,
  LogInButton,
  RegisterButton,
} from "@/components/component/auth/auth";
import {
  Section,
  Container,
  Flex,
  Heading,
  Box,
  Button,
} from "@radix-ui/themes";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white p-4">
        <Container size="2">
          <Flex justify="between" align="center">
            <Flex gap="4" align="center">
              <Heading size="2" className="text-white"></Heading>
              {session ? (
                <span className="mx-2 text-2xl font-bold">
                  {session?.user?.name}
                </span>
              ) : null}
            </Flex>
          </Flex>
        </Container>
        <Container position="absolute" top="0" right="0" size="1" pt={"2"}>
          {session ? (
            <LogOutButton />
          ) : (
            <Flex>
              <LogInButton /> <RegisterButton />
            </Flex>
          )}
        </Container>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Section size="3" mx="6">
          <Container size="2">
            <Flex direction="column" align="center" gap="7">
              <Heading size="2" className="text-white">
                Welcome to NoteGenius
              </Heading>
              <Box className="text-gray-400 text-center">
                The advanced note-organizing platform powered by AI
                technologies.
              </Box>
              <Box className="mt-8">
                <Flex gap="4">
                  <Link href="/folders">
                    <Button>Go to Folders</Button>
                  </Link>
                  <Link href="/chat">
                    <Button>Go to Chat</Button>
                  </Link>
                </Flex>
              </Box>
            </Flex>
          </Container>
          <div className="flex items-center justify-center mt-5">
            <Link href="/refine-notes">
              <Button size={"3"}>Refine a Note!</Button>
            </Link>
          </div>
        </Section>
      </main>
    </div>
  );
}
