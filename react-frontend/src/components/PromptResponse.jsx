import React, { useState } from "react";
import styled from "styled-components";

const PromptResponse = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPrediction = async (prompt) => {
    setIsLoading(true);
    setResponse("");
    let fullResponse = "";

    try {
      const response = await fetch(
        "https://e619-135-0-165-43.ngrok-free.app/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data: ")) continue;

          const eventData = line.substring(6);

          if (eventData === "[DONE]") {
            continue;
          }

          try {
            const jsonData = JSON.parse(eventData);

            if (jsonData.response) {
              fullResponse += jsonData.response;
              setResponse((prev) => `${prev}${jsonData.response}`);
            }
          } catch (err) {
            console.error("Error parsing JSON:", err, eventData);
          }
        }
      }

      setResponse(`${fullResponse}`);
    } catch (error) {
      console.error("Error in getPrediction:", error);
      setResponse(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }
    getPrediction(prompt);
  };

  return (
    <StyledWrapper>
      <h1
        className="title-orbitron"
        style={{ fontSize: "clamp(28px, 5vw, 60px)" /* Test override */ }}
      >
        Intelli-G A.I.
      </h1>
      <div id="poda">
        <div className="glow" />
        <div className="darkBorderBg" />
        <div className="darkBorderBg" />
        <div className="darkBorderBg" />
        <div className="white" />
        <div className="border" />
        <div id="main">
          <textarea
            id="prompt"
            rows={5}
            className="prompt"
            placeholder="Enter prompt: "
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>

          <div className="filterBorder" />
          <div id="filter-icon">
            <button id="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
          <div id="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              height={24}
              fill="none"
              className="feather feather-search"
            >
              <path
                stroke="url(#search)"
                d="M12 4a8 7 0 1 0 0 14a8 7 0 0 0 0 -14M12 2v20"
              />
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search">
                  <stop stopColor="#f8e7f8" offset="0%" />
                  <stop stopColor="#b6a9b7" offset="50%" />
                </linearGradient>
                <linearGradient id="searchl">
                  <stop stopColor="#b6a9b7" offset="0%" />
                  <stop stopColor="#837484" offset="50%" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div id="response">{response ? response : null}</div>
        </div>
      </div>
      <h1
        className="title-orbitron"
        style={{ fontSize: "clamp(8px, 10px, 14px)" }}
      >
        <a
          href="https://github.com/myopicOracle"
          style={{
            color: "inherit",
            textDecoration: "none",
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span style={{ color: "#ffffff" }}>@</span>
          <span>myopicOracle</span>
        </a>
      </h1>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: transparent;
  isolation: isolate;
  padding: 2rem;
  
  h1 {
    position: fixed;
    top: 0.5rem;
    left: 2rem;
    font-size: 2rem;
    z-index: 10;
  }

  /* DESKTOP-and-ABOVE media queries */
  @media (min-width: 768px) {
  
    h1 {
      position: fixed;
      top: 2rem;
      left: 2rem;
      font-size: 2rem;
      z-index: 10;
    }
  
    .title-orbitron {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 60px;
      color: #00d4ff; 
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
      text-align: center;
      margin: 10vh 8vw;
    }

    .title-exo2 {
      font-family: 'Exo 2', sans-serif;
      font-weight: 600;
      font-size: 2.5rem;
      color: #ffffff; 
      text-transform: uppercase;
      letter-spacing: 1.5px;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
      text-align: center;
      margin: 20px 0;
    }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        to right,
        rgba(15, 15, 16, 0.2) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(15, 15, 16, 0.2) 1px, transparent 1px);
    background-size: 1rem 1rem;
    mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
    z-index: -2;
  }

  .glow,
  .white,
  .border,
  .darkBorderBg {
    filter: blur(3px) brightness(1.2);
  }

  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 70px;
    max-width: 314px;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    /* Border Radius */
    border-radius: 12px;
    filter: blur(3px);
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, black);
    top: 18px;
    left: 70px;
  }

  #pink-mask {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #cf30aa;
    top: 10px;
    left: 5px;
    filter: blur(15px); /* Consolidated from 20px and 15px */
    opacity: 0.9; /* Consolidated from 0.8 and 0.9 */
    animation: leftright 4s ease-in-out infinite; /* Reintroduced animation */
  }

  #main:hover > #pink-mask {
    opacity: 0;
    transition: opacity 0.5s ease; /* Added transition for smooth opacity change */
  }

  .white {
    max-height: 63px;
    max-width: 307px;
    border-radius: 10px;
    filter: blur(2px);
  }

  .white::before {
    content: "";
    z-index: -2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    width: 300px; /* Reduced from 600px for performance */
    height: 300px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #a099d8,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #dfa2da,
      rgba(0, 0, 0, 0) 58%
    );
    transition: transform 2s ease; /* Specific transition for transform only */
  }

  .border {
    max-height: 59px;
    max-width: 303px;
    border-radius: 11px;
    filter: blur(0.5px);
  }

  .border::before {
    content: "";
    z-index: -2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    width: 300px; /* Reduced from 600px */
    height: 300px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #1c191c,
      #402fb5 5%,
      #1c191c 14%,
      #1c191c 50%,
      #cf30aa 60%,
      #1c191c 64%
    );
    transition: transform 2s ease;
  }

  .darkBorderBg {
    max-height: 65px;
    max-width: 312px;
  }

  .darkBorderBg::before {
    content: "";
    z-index: -2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    width: 300px; /* Reduced from 600px */
    height: 300px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #18116a,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #6e1b60,
      rgba(0, 0, 0, 0) 60%
    );
    transition: transform 2s ease;
  }

  .glow {
    overflow: hidden;
    filter: blur(20px); /* Reduced from 30px for better visibility */
    opacity: 0.6; /* Increased from 0.4 for better visibility */
    max-height: 130px;
    max-width: 568px;
  }

  .glow::before {
    content: "";
    z-index: -2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    width: 500px; /* Reduced from 999px for performance */
    height: 500px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #000,
      #402fb5 5%,
      #000 38%,
      #000 50%,
      #cf30aa 60%,
      #000 87%
    );
    animation: rotate 6s linear infinite; /* Reintroduced animation */
  }

  /* Consolidated hover rules */
  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(-98deg);
  }

  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(-120deg);
  }

  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(-97deg);
  }

  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(-110deg);
  }

  /* Focus-within rules remain unchanged as they seem intentional */
  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: transform 4s ease;
  }

  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: transform 4s ease;
  }

  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: transform 4s ease;
  }

  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: transform 4s ease;
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
  @keyframes leftright {
    0% {
      transform: translate(0px, 0px);
      opacity: 1;
    }

    49% {
      transform: translate(250px, 0px);
      opacity: 0;
    }
    80% {
      transform: translate(-40px, 0px);
      opacity: 0;
    }

    100% {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }

  /////////////////////////////////////////////////////////////

  /* MOBILE SIZES - BELOW 768px */

  /////////////////////////////////////////////////////////////

  #poda {
    position: relative;
    max-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-20%);
  }

  .prompt {
    background-color: rgba(1, 2, 1, 0.75);
    border: none;
    resize: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    padding: 24px 24px 60px 54px;
    width: 70vw;
    height: clamp(50px, 13vh, 150px);

    border-radius: 10px;
    color: white;
    font-size: 12px;

    font-family: "Jura", sans-serif;

    line-height: 1.3;
    font-weight: 400;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 20px rgba(207, 48, 170, 0.1);

    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.6s ease;

    &:hover {
      scrollbar-color: rgba(207, 48, 170, 0.5) transparent;
    }

    /* Chrome/WebKit scrollbar */
    &::-webkit-scrollbar {
      width: 6px;
      height: 0;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(207, 48, 170, 0);
      border-radius: 3px;
      transition: background-color 0.3s ease;
    }

    &::-webkit-scrollbar-button {
      display: none;
      height: 0;
      width: 0;
    }

    /* Show scrollbar on hover/scroll */
    &:hover::-webkit-scrollbar-thumb {
      background: rgba(207, 48, 170, 0.5);
    }

    &:hover::-webkit-scrollbar-thumb:hover {
      background: rgba(207, 48, 170, 0.8);
    }

    /* Ensure content doesn't shift when scrollbar appears */
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      background-clip: padding-box;
      border: 2px solid transparent;
    }
  }

  .prompt::placeholder {
    color: #c0b9c0;
    font-size: 12px;
    font-weight: 500;
  }

  .prompt:focus {
    outline: none;
  }

  #response {
    position: absolute;

    transform: translateY(12px);
    width: 100%;
    max-width: 80vw;
    max-height: 25vh;
    height: auto;
    overflow-y: auto;
    padding: 20px 6px 20px 18px;
    z-index: 1;
    font-family: "Baumans", sans-serif;

    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    color: #c0b9c0;
    background: radial-gradient(
      circle at center,
      rgba(29, 24, 60, 0.1) 0%,
      rgba(13, 12, 35, 0.7) 100%
    );
    border-radius: 10px;
    backdrop-filter: blur(16px);
    display: block; /* Default display */

    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.6s ease;

    &:hover {
      scrollbar-color: rgba(207, 48, 170, 0.5) transparent;
    }

    /* Chrome/WebKit scrollbar */
    &::-webkit-scrollbar {
      width: 6px;
      height: 0;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(207, 48, 170, 0);
      border-radius: 3px;
      transition: background-color 0.3s ease;
    }

    &::-webkit-scrollbar-button {
      display: none;
      height: 0;
      width: 0;
    }

    /* Show scrollbar on hover/scroll */
    &:hover::-webkit-scrollbar-thumb {
      background: rgba(207, 48, 170, 0.5);
    }

    &:hover::-webkit-scrollbar-thumb:hover {
      background: rgba(207, 48, 170, 0.8);
    }

    /* Ensure content doesn't shift when scrollbar appears */
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      background-clip: padding-box;
      border: 2px solid transparent;
    }
  }

  #response:empty {
    display: none; /* Hide when empty */
  }

  #submit {
    background: linear-gradient(180deg, #161329, black, #1d1b4b);
    border: 1px solid transparent;
    border: none;
    color: white;
    padding: 3px 8px;
    text-align: center;

    font-family: "Orbitron", sans-serif;

    font-size: 10px;
    font-weight: 700;
    text-decoration: none;
    display: inline-block;
    margin: 3px 1px;
    cursor: pointer;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 15px rgba(207, 48, 170, 0.15);
  }

  #filter-icon {
    position: absolute;
    bottom: 21px; /* Changed from top to bottom */
    right: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-height: 30px;
    max-width: 80px;
    height: 100%;
    width: 100%;

    isolation: isolate;
    overflow: hidden;
    /* Border Radius */
    border-radius: 10px;
    background: linear-gradient(180deg, #161329, black, #1d1b4b);
    border: 1px solid transparent;

    box-shadow: 0 0 15px rgba(207, 48, 170, 0.15);
  }

  .filterBorder {
    height: 32px;
    width: 82px;
    position: absolute;
    overflow: hidden;
    bottom: 20px; /* Changed from top to bottom */
    right: 20px;
    border-radius: 10px;
  }

  .filterBorder::before {
    content: "";

    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #3d3a4f,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #3d3a4f,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }

  #main {
    position: relative;
  }

  #search-icon {
    position: absolute;
    left: 20px;
    top: 22px;
  }

  /////////////////////////////////////////////////////////////

  /* DESKTOP-and-ABOVE media queries */
  @media (min-width: 768px) {
    #poda {
      position: relative;
      max-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(5%);
    }

    .prompt {
      background-color: rgba(1, 2, 1, 0.8);
      border: none;
      resize: none;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 24px 128px 24px 59px;
      width: 602px;
      height: clamp(50px, 10vh, 120px);

      border-radius: 10px;
      color: white;
      font-size: 14px;

      font-family: "Jura", sans-serif;

      line-height: 1.3;
      font-weight: 400;
      backdrop-filter: blur(15px);
      box-shadow: 0 0 20px rgba(207, 48, 170, 0.1);

      /* Firefox scrollbar */
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
      transition: scrollbar-color 0.6s ease;

      &:hover {
        scrollbar-color: rgba(207, 48, 170, 0.5) transparent;
      }

      /* Chrome/WebKit scrollbar */
      &::-webkit-scrollbar {
        width: 6px;
        height: 0;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(207, 48, 170, 0);
        border-radius: 3px;
        transition: background-color 0.3s ease;
      }

      &::-webkit-scrollbar-button {
        display: none;
        height: 0;
        width: 0;
      }

      /* Show scrollbar on hover/scroll */
      &:hover::-webkit-scrollbar-thumb {
        background: rgba(207, 48, 170, 0.5);
      }

      &:hover::-webkit-scrollbar-thumb:hover {
        background: rgba(207, 48, 170, 0.8);
      }

      /* Ensure content doesn't shift when scrollbar appears */
      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        border: 2px solid transparent;
      }
    }

    .prompt::placeholder {
      color: #c0b9c0;
      font-size: 14px;
      font-weight: 500;
    }

    .prompt:focus {
      outline: none;
    }

    #response {
      font-size: 14px;
      line-height: 1.5;
      padding: 20px 5px 20px 20px;
    }

    #submit {
      background: linear-gradient(180deg, #161329, black, #1d1b4b);
      border: 1px solid transparent;
      border: none;
      color: white;
      padding: 8px 16px;
      text-align: center;
      text-decoration: none;
      display: inline-block;

      font-family: "Orbitron", sans-serif;

      font-size: 12px;
      font-weight: 700;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 10px;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(5px);
      box-shadow: 0 0 15px rgba(207, 48, 170, 0.15);
    }

    #filter-icon {
      position: absolute;
      bottom: 19px; /* Changed from top to bottom */
      right: 19px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      max-height: 36px;
      max-width: 100px;
      height: 100%;
      width: 100%;

      isolation: isolate;
      overflow: hidden;
      /* Border Radius */
      border-radius: 10px;
      background: linear-gradient(180deg, #161329, black, #1d1b4b);
      border: 1px solid transparent;

      box-shadow: 0 0 15px rgba(207, 48, 170, 0.15);
    }

    .filterBorder {
      height: 38px;
      width: 102px;
      position: absolute;
      overflow: hidden;
      bottom: 18px; /* Changed from top to bottom */
      right: 18px;
      border-radius: 10px;
    }

    .filterBorder::before {
      content: "";

      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(90deg);
      position: absolute;
      width: 600px;
      height: 600px;
      background-repeat: no-repeat;
      background-position: 0 0;
      filter: brightness(1.35);
      background-image: conic-gradient(
        rgba(0, 0, 0, 0),
        #3d3a4f,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0) 50%,
        #3d3a4f,
        rgba(0, 0, 0, 0) 100%
      );
      animation: rotate 4s linear infinite;
    }

    #main {
      position: relative;
    }

    #search-icon {
      position: absolute;
      left: 20px;
      top: 22px;
    }
  }
`;

export default PromptResponse;
