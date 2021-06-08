import { ReactNode, useEffect, useState } from "react";
import { AuthContext, User } from "./AuthContext";
import { gapi, loadAuth2 } from "gapi-script";

//TODO: Not sure if it is correct
type GoogleAuth = gapi.auth2.GoogleAuth;
type AuthProviderProps = {
  children: ReactNode;
};
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    const init = async () => {
      const auth: GoogleAuth = await loadAuth2(
        gapi,
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY,
        ""
      );
      if (auth.isSignedIn.get()) {
        const user = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile();
        setUser({ name: user.getName(), email: user.getEmail() });
      }
    };
    init();
  }, []);

  const login = () => {
    const auth = gapi.auth2.getAuthInstance();

    auth.signIn().then(async () => {
      const user = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile();
      setUser({ name: user.getName(), email: user.getEmail() });
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/user/login/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify({
            id_token: auth.currentUser.get().getAuthResponse().id_token,
            access_token: auth.currentUser.get().getAuthResponse().access_token,
            expires_in: auth.currentUser.get().getAuthResponse().expires_in,
            user_id: auth.currentUser.get().getId(),
          }),
        }
      );
      // TODO: Send the access token or id_token to server for verification
    });
  };

  const logout = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const value = {
    user,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
