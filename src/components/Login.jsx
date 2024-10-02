import React from "react";
import { auth, provider, signInWithPopup } from "../Firebase";
import icon from "../assests/icon.jpg";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";

const Login = () => {
  const Navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      console.log('uid', uid);
      localStorage.setItem("uid", uid);
      Navigate("/home");
    } catch (error) {
      console.error("Error during login", error);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        padding: "0 50px",
      }}
    >
      <div style={{ flex: "1", display: "flex", justifyContent: "flex-start" }}>
        <img
          src={icon}
          alt="logo"
          style={{ maxWidth: "80%", height: "auto" }}
        />
      </div>
      <div
        style={{
          // This takes up the right side
          display: "flex",
          flexDirection: "column",
          marginRight: "200px",
        }}
      >
        {/* <h1>Login Page</h1> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
            border:'2px solid #79d979',
            padding:'5px',
            borderRadius:'20px',
            backgroundColor:'#79d9792e'
          }}
        >
          <FcGoogle size={"30px"} />
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: "10px 10px",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
              borderRadius: "5px",
              // backgroundColor: "#79d979",
              backgroundColor: "transparent",

            }}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
