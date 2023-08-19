import { useState } from "react";
import Input from "../components/input";
import {
  SignInAuthUserWithEmailAndPassword,
  getUserInfoFromDataBase,
} from "../utils/firebase";
import { userSignedIn } from "../utils/zustand";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(null);
  const setCurrentUser = userSignedIn((state) => state.setCurrentUser);
  const navigate = useNavigate();

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const { user } = await SignInAuthUserWithEmailAndPassword(email, pass);
      const userData = await getUserInfoFromDataBase(user.uid);
      // setCurrentUser(userData);
      navigate("/");
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/user-not-found":
          setEmailError("user-not-found");
          setPassError(null);
          return;
        case "auth/wrong-password":
          setPassError("wrong-password");
          setEmailError(null);
          return;
      }
    }
  };

  return (
    <div className="bg-[url('src/assets/imgs/bg.png')] bg-center bg-cover min-h-screen w-full flex justify-center items-center p-5">
      <div
        className={`w-4/5 sm:w-2/5 h-fit bg-gray-700 text-gray-200 rounded-md p-5`}
      >
        <div className="flex-col sm:flex-row flex gap-10">
          <form
            onSubmit={submitData}
            className="flex flex-col gap-5 w-full sm:w-2/3"
          >
            <Input
              title={"EMAIL"}
              value={email}
              type={"email"}
              set={setEmail}
            />
            {emailError && (
              <div className="text-red-500 text-sm">{emailError}</div>
            )}
            <Input
              title={"PASSWORD"}
              value={pass}
              set={setPass}
              type={"password"}
            />
            {passError && (
              <div className="text-red-500 text-sm">{passError}</div>
            )}
            <a href="#" className="text-blue-500 text-sm">
              Forgot password?
            </a>
            <button className="bg-indigo-600 py-2 rounded-md">Log In</button>
            <p className="text-sm">
              Need an account?{" "}
              <a href="/signup" className="text-blue-500">
                Register
              </a>
            </p>
          </form>
          <div className="w-full sm:w-1/3 flex flex-col items-center gap-2">
            <img src="src/assets/imgs/QR.png" />
            <h1 className="text-xl text-white">Login with QR code</h1>
            <p className="text-sm text-gray-300 text-center">
              Scan this with{" "}
              <a href="#" className="font-bold">
                Discord mobile app
              </a>{" "}
              to login in instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
