import localForage from "localforage";
import { createContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Realm from "realm-web";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children, app: mongoRealm }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateUser = (u) => {
    if (u) {
      u.apiKeys.create("myApiKey").then((x) =>
        localForage
          .setItem(process.env.REACT_APP_USER_STORE_KEY, x)
          .catch(function (err) {
            console.log(err);
          })
      );
      setUser(u);
    } else {
      setUser("");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      toast("Logging in!");
      mongoRealm
        .logIn(credentials)
        .then(updateUser)
        .catch((err) => {
          console.log(err);
          mongoRealm.emailPasswordAuth
            .registerUser({ email, password })
            .then(() => {
              toast("Looks like you have no account. Signing you up!");

              const c = Realm.Credentials.emailPassword(email, password);
              mongoRealm.logIn(c).then(updateUser);
            });
        });
    } catch (err) {
      console.error("Failed to log in", err);
    }
  };

  useEffect(() => {
    setLoading(true);

    localForage
      .getItem(process.env.REACT_APP_USER_STORE_KEY)
      .then(function (value) {
        const c = Realm.Credentials.apiKey(value.key);
        mongoRealm.logIn(c).then(updateUser);
      })
      // .catch(function (err) {
      //   const c = Realm.Credentials.anonymous();
      //   mongoRealm.logIn(c).then(updateUser);
      // })
      .finally(() => {
        setLoading(false);
      });

    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner variant="border" size="sm"></Spinner>;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        email,
        password,
        setEmail,
        setPassword,
        onSubmit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
