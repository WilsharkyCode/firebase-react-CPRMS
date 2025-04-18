import { auth } from "../config/firebase-config";
import { signOut } from "firebase/auth";

export default function SignOutBtn() {

    const handleSignOut =() => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign out successful")
          }).catch((error) => {
            // An error happened.
          });;
    };

    return(
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSignOut}
          >
            Logout
          </button>
    )
}