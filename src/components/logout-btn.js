import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import localForage from "localforage";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { MongoContext } from "../context/mongo-context";

function LogoutBtn(props) {
  const { mongoRealm, setUser, user, isAnon, setSignInBtn } =
    useContext(MongoContext);

  const signOut = () => {
    mongoRealm.currentUser.logOut();
    localForage
      .removeItem(process.env.REACT_APP_USER_STORE_KEY)
      .catch(function (err) {
        console.log(err);
      });
    toast("Logging out!", { autoClose: 2000 });
    setUser("");
  };

  if (isAnon) {
    return (
      <Button
        onClick={() => {
          setUser("");
          setSignInBtn(true);
        }}
        variant="light"
        size="sm"
      >
        {" "}
        Sign In
      </Button>
    );
  }
  return user && !isAnon ? (
    <Button
      onClick={() => signOut()}
      variant="outline"
      className="p-0 text-white"
      size="sm"
    >
      {" "}
      Logout
      <FontAwesomeIcon
        icon={faSignOut}
        size="sm"
        color="grey"
        className="mx-2"
      />
    </Button>
  ) : null;
}

export default LogoutBtn;
