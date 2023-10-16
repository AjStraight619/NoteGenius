import {
  LogInButton,
  LogOutButton,
  RegisterButton,
} from "@/components/component/auth/auth";
import { authOptions } from "@/utils/authOptions";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Section,
} from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
                <Link
                  href="/refine-note
                "
                  passHref
                >
                  <Button>Refine a Note</Button>
                </Link>
              </Flex>
            </Flex>
          </Container>
        </Section>
        <Section size="3" className="mt-5 flex justify-center">
          <Link href="/ai-tutor" passHref>
            <Button radius="medium" size="3">
              Chat with Note Genius
            </Button>
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
