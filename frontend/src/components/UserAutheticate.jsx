import React, { useContext } from "react";
import LoginForm from "../pages/Login";
import SignUpForm from "../pages/SignUp";
import { AuthContext } from "../context/AuthContext";

const Authentication = () => {
  const { swap } = useContext(AuthContext);

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.hdwallpaper.nu/wp-content/uploads/2015/09/7efae7f6dce13596b70641cc2b274431.jpg"
          alt="Beach background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Transparent Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-1"></div>

      {/* Login or SignUp Form */}
      <div className="relative z-2">
        <div className="bg-transparent flex items-center justify-center w-80">
          <div className="max-w-md w-full">
            {swap ? <SignUpForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
