import Link from "next/link";
import { useAuth } from "./auth/AuthContext";
import { Button } from "./components";

const links = [
  {
    title: "Home",
    href: "/",
  },
];

export function Layout({ children }) {
  const { user, login, logout } = useAuth();
  return (
    <div maxW="640px" mx="auto">
      <header>
        <div
          variant="container"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py="4"
        >
          <Link href="/" passHref>
            <a
              textDecoration="none"
              color="text"
              fontSize="lg"
              fontWeight="semibold"
            >
              Axelerant Worklogs
            </a>
          </Link>
          <nav>
            <ul display="grid" col={3} gap="4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} passHref>
                    <a textDecoration="none" color="text" fontSize="sm">
                      {link.title}
                    </a>
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>Hi, {user.username}</li>
                  <li onClick={logout}>Logout</li>
                </>
              ) : (
                <li>
                  <Link href="/login" passHref>
                    <a textDecoration="none" color="text" fontSize="sm">
                      Login/SignUp
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main variant="container" py="10">
        {children}
      </main>
    </div>
  );
}
