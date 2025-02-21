import React, { useEffect, useState, useRef } from "react";
import { Button, Switch, Container } from "@mui/material";
import confetti from "canvas-confetti";

const OneCompilerEditor = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const savedCode = localStorage.getItem("editorCode");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  useEffect(() => {
    window.onmessage = (e) => {
      if (e.data && e.data.files) {
        setCode(e.data.files[0].content);
        localStorage.setItem("editorCode", e.data.files[0].content);
      }
    };
  }, []);

  const handleRun = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { eventType: "triggerRun" },
        "*"
      );
      confetti();
    }
  };

  const handleFormat = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        {
          eventType: "populateCode",
          language: "javascript",
          files: [{ name: "script.js", content: code }],
        },
        "*"
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container
      style={{
        background: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Switch checked={darkMode} onChange={toggleDarkMode} />
      Dark Mode
      <Button
        variant="contained"
        onClick={handleRun}
        style={{ margin: "10px" }}
      >
        Run
      </Button>
      <Button
        variant="contained"
        onClick={handleFormat}
        style={{ margin: "10px" }}
      >
        Format Code
      </Button>
      <iframe
        id="oc-editor"
        ref={iframeRef}
        frameBorder="0"
        height="450px"
        src={`https://onecompiler.com/embed/javascript?codeChangeEvent=true&theme=${
          darkMode ? "dark" : "light"
        }`}
        width="100%"
        title="OneCompiler Embedded Editor"
      ></iframe>
    </Container>
  );
};

export default OneCompilerEditor;
