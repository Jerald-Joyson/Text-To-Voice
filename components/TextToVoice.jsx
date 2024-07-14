"use client";
import { useState, useEffect } from "react";

const TextToVoice = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      console.log(
        "Fetching voices:",
        availableVoices.length > 0 ? "OK" : "Failed"
      );
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]?.name || "");
    };

    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
  }, []);

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    if (!synth.speaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices.find((voice) => voice.name === selectedVoice);

      console.log("Input text:", text);

      utterance.onstart = () => {
        console.log("Speech synthesis started");
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log("Speech synthesis ended");
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
      };

      synth.speak(utterance);
    }
  };

  const handlePauseResume = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      if (isSpeaking) {
        synth.pause();
        setIsSpeaking(false);
        console.log("Speech paused");
      } else {
        synth.resume();
        setIsSpeaking(true);
        console.log("Speech resumed");
      }
    }
  };

  return (
    <div className="h-screen w-screen pt-10 px-5 bg-blue-500">
      <header className="text-4xl font-bold text-center mb-6 text-white">
        Text To Voice
      </header>
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <p className="text-sm text-center mb-4 text-gray-600">
          Convert your text to voice using the browser's speech synthesis API.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Enter Your Text:
            </label>
            <textarea
              className="w-full h-28 p-3 border border-gray-300 rounded-md text-black"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Select Voice:
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md text-black"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-around">
            <button
              type="button"
              className="w-[130px] py-3 px-4 bg-blue-600 border-blue-600 border-2 text-white rounded-md hover:bg-white hover:text-blue-600 hover:border-blue-500 hover:border-2 transition"
              onClick={handleSpeak}
            >
              Convert
            </button>
            {text.length > 60 && (
              <button
                type="button"
                className="w-[130px] py-3 px-4 bg-gray-600 border-gray-600 border-2 text-white rounded-md hover:bg-white hover:text-gray-600 hover:border-gray-600 hover:border-2 transition"
                onClick={handlePauseResume}
              >
                {isSpeaking ? "Pause" : "Resume"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextToVoice;
