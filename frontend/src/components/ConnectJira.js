import React, { useEffect } from "react";
import { connectJira } from "../services/api";

const ConnectJira = ({ setAccessToken }) => {
  // Check if redirected back from OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      setAccessToken(token);
      // Remove token from URL
      window.history.replaceState({}, document.title, "/");
    }
  }, [setAccessToken]);

  return (
    <button
      onClick={connectJira}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Connect Jira
    </button>
  );
};

export default ConnectJira;
