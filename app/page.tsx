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
import "./home-styles.css";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="home-gradient flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="p-4 border-b border-gray-800">
        <Container size="2">
          <Flex justify="between" align="center">
            <Heading size="2">NoteGenius</Heading>

            <Flex align="center" gap="4">
              {session ? (
                <>
                  <span className="mx-2 text-2xl font-bold">
                    {session?.user?.name}
                  </span>
                  <LogOutButton />
                </>
              ) : (
                <>
                  <LogInButton />
                  <RegisterButton />
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <Section size="3">
          <Container size="2">
            <Flex direction="column" align="center" gap="7">
              <Heading size="2">Welcome to NoteGenius</Heading>
              <Box className="text-gray-400 text-center">
                The advanced note-organizing platform powered by AI
                technologies.
              </Box>
              <Flex gap="4" className="mt-8">
                <Link href="/folders" passHref>
                  <Button>Go to Folders</Button>
                </Link>
                <Link href="/chat" passHref>
                  <Button>Go to Chat</Button>
                </Link>
              </Flex>
            </Flex>
          </Container>
        </Section>
        <Section size="3" className="mt-5 flex justify-center">
          <Link href="/refine-notes" passHref>
            <Button size="3">Refine a Note!</Button>
          </Link>
        </Section>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-800">
        <Container size="2">
          <Flex justify="between" align="center">
            <Box>© 2023 NoteGenius</Box>
            <Flex gap="4">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white"
                passHref
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white"
                passHref
              >
                Terms
              </Link>
            </Flex>
          </Flex>
        </Container>
      </footer>
    </div>
  );
}
