import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { useState } from "react";
import API from "../api/axios.js";
import loginbg from "../assets/loginbg.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", { name, email, password });
      const { user, accessToken } = res.data;

      login(user, accessToken);
      return navigate("/dashboard");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex items-center w-full h-[90%] p-5 justify-center font-mont bg-[#d9d9d9] ">
      <div className="flex items-center justify-center  h-full w-[60%] bg-white">
        <div className="first basis-1/2 bg-white py-10 px-5 items-center justify-center flex flex-col h-full">
          <div className="box flex-col flex items-center justify-around  w-full">
            <h1 className="text-5xl m-5">Register</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center  w-full h-full"
            >
              <input
                className="m-4 p-3 text-l w-full border-b-2 border-green-800 outline-none"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Firstname"
              />
              <input
                className="m-4 p-3 text-l w-full border-b-2 border-green-800 outline-none"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
              />

              <input
                className="m-4 p-3 text-l w-full border-b-2 border-green-800 outline-none"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              <button
                type="submit"
                className="bg-green-800 text-amber-50 w-full py-3 mt-10 rounded-4xl"
              >
                Register
              </button>
            </form>
          </div>
        </div>
        <div className="second h-full basis-1/2">
          <img src={loginbg} alt="login pic" className=" w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Register;

//<div className="flex items-center justify-center ">
//   <h1>Register</h1>
//   <form onSubmit={handleSubmit}>
//     <div>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Firstname"
//       />
//     </div>

//     <div>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="email"
//       />
//     </div>

//     <div>
//       <input
//         value={password}
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//       />
//     </div>
//     <button type="submit">Register</button>
//   </form>
// </div>
