import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Navbar = () => {
  const { handleAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log(name)
  let roles = localStorage.getItem("roles");
  let name= localStorage.getItem("name")
  const handleLogout = () => {
    handleAuth();
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };
  // console.log(roles);
  return (
    <>
      <nav className="bg-blue-200 text-4xl shadow-sm  p-3 flex justify-between items-center">
        <h1 className="text-black text-xl">Books Store</h1>
        <div className="">
          <p className="text-black text-md">Welcome {name}</p>
          <p className="text-black text-md">ROLE: {roles}</p>
        </div>
        <button
          className="text-black text-lg border border-x-white rounded px-2 py-1 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </>
  );
};

export default Navbar;
