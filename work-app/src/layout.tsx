import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "./auth/AuthContext";

// const links = [
//   {
//     title: "New Worklog",
//     href: "/worklogs/new",
//   },
// ];

export function Layout({ children }) {
  const { user, token, logout } = useAuth();
  const { push } = useRouter();
  useEffect(() => {
    if (!token) {
      push("/login");
    }
  }, [token]);
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
            <ul display="flex" justifyContent="space-between">
              {token && user ? (
                <>
                  <li mx="4">
                    <Link href="/worklogs/new" passHref>
                      <a textDecoration="none" color="text" fontSize="sm">
                        New Worklog
                      </a>
                    </Link>
                  </li>
                  <li mx="4">Hi, {user.username}</li>
                  <li onClick={logout} mx="4">
                    Logout
                  </li>
                </>
              ) : (
                <li mx="4">
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
