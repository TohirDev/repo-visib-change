import React from "react";
import { Button, Typography } from "beauty-ui-components";

import {
  getGithubUsername,
  getUserToken,
  setGithubUsername,
  setToken,
} from "../globals";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

const SaveUser: React.FC = () => {
  const userRef = React.useRef<HTMLInputElement>(null);
  const tokenRef = React.useRef<HTMLInputElement>(null);
  const userName = getGithubUsername();
  const token = getUserToken();
  const navigate = useNavigate();
  function saveInfo() {
    if (userRef.current && tokenRef.current) {
      const username = userRef.current.value.trim();
      const token = tokenRef.current.value.trim();
      if (username && token) {
        setGithubUsername(username);
        setToken(token);
        alert("Information saved successfully!");
        navigate("/change-visib");
      } else {
        alert("Please fill in both fields.");
      }
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h2">Change your repo visibility</Typography>
      <Input
        ref={userRef}
        placeholder={`${
          userName ? "Change your username" : "Enter your username"
        }`}
        className="w-[300px] mt-2"
      />
      <Input
        ref={tokenRef}
        placeholder={token ? "Change your token" : "Enter your token"}
        className="w-[300px] mt-2"
      />
      <Button
        variant="default"
        sx={{ width: 300, marginTop: 10 }}
        onClick={saveInfo}
      >
        Submit
      </Button>
    </div>
  );
};

export default SaveUser;
