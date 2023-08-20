import { useEffect, useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  getAllDataFromServer,
} from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import Select from "../components/select";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [mon, setMon] = useState("January");
  const [day, setDay] = useState("1");
  const [year, setYear] = useState("2022");
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [isUserUsed, setIsUserUsed] = useState(false);

  useEffect(() => {
    getAllDataFromServer("users").then((data) => {
      setUserData(data);
    });
  }, []);

  const checkIfUserNameIsUsed = () => {
    const userUsed = userData.find((user) => {
      if (user.userName === userName) {
        return user;
      }
    });
    setIsUserUsed(userUsed ? true : false);
  };

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    return days;
  };

  const years = () => {
    const years = [];
    for (let i = 1871; i <= 2022; i++) {
      years.push(i);
    }
    return years;
  };

  const submitNewUser = async (e) => {
    e.preventDefault();
    checkIfUserNameIsUsed();
    if (isUserUsed) {
      return;
    }
    try {
      const { user } = await createAuthUserWithEmailAndPassword(email, pass);
      await createUserDocumentFromAuth(user, {
        id: user.uid,
        displayName: name,
        born: `${mon}-${day}-${year}`,
        userName,
        userImg:
          "https://firebasestorage.googleapis.com/v0/b/discord-clone-329df.appspot.com/o/default_256_256.png?alt=media&token=1a569c92-5085-4fac-951d-b6b4228c385c",

        joinedServers: [],
        userFriends: [],
        userOnline: false,
        userTime: null,
      });
      navigate("/");
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/email-already-in-use":
          setEmailError("email-already-in-use");
      }
    }
  };

  return (
    <div className="bg-[url('src/assets/imgs/bg.png')] bg-center bg-cover min-h-screen w-full flex justify-center items-center p-5">
      <div
        className={`w-4/5 sm:w-2/5 lg:w-1/5 h-fit bg-gray-700 text-gray-200 rounded-md p-5`}
      >
        <form onSubmit={submitNewUser} className="flex flex-col gap-2 w-full">
          <Input title={"EMAIL"} value={email} set={setEmail} type={"email"} />
          {emailError && (
            <div className="text-red-500 text-sm">{emailError}</div>
          )}
          <Input
            title={"DISPLAY NAME"}
            value={name}
            set={setName}
            type={"text"}
          />
          <Input
            title={"USERNAME"}
            value={userName}
            set={setUserName}
            type={"text"}
          />
          {isUserUsed && (
            <div className="text-sm text-red-500">{"User Is Already Used"}</div>
          )}
          <Input
            title={"PASSWORD"}
            value={pass}
            set={setPass}
            type={"password"}
          />
          <div className="text-sm flex items-center gap-2">
            Date of Birth<span className="text-red-500">*</span>
          </div>
          <div className="flex justify-between gap-5">
            <Select data={month} value={mon} set={setMon} />
            <Select data={days()} value={day} set={setDay} />
            <Select data={years()} value={year} set={setYear} />
          </div>
          <button className="bg-indigo-600 py-2 rounded-md">Continue</button>
          <a href="/signin" className="text-blue-500">
            Already have an account?
          </a>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
