import React, { useState, useRef, useEffect } from "react";
import "./timer.css";
import { formatTime, convertToSeconds } from "./utils";

const ACTIVE = "ACTIVE";
const PAUSED = "PAUSED";
const STOPPED = "STOPPED";

const DEFAULT_TIME = "00:05:00";
const DEFAULT_SECONDS = 300;

const TIMER_KEY = "timerTime";

function Timer({}) {
    const [timeRemaining, setTimeRemaining] = useState(localStorage.getItem(TIMER_KEY) || DEFAULT_SECONDS);
    const [inputTime, setInputTime] = useState("");
    const [timerState, setTimerState] = useState(timeRemaining ? PAUSED : STOPPED);
    const interval = useRef(null);

    // Start the timer
    const handleStart = () => {
        setTimerState(ACTIVE);

        interval.current = setInterval(() => {
            setTimeRemaining(prevTime => {
                localStorage.setItem(TIMER_KEY, prevTime - 1);
                return prevTime - 1;
            });
        }, 1000);
    };

    // Pause the timer
    const handlePause = () => {
        clearInterval(interval.current);
        interval.current = null;
        setTimerState(PAUSED);
    };

    // Reset the timer
    const handleStop = () => {
        setInputTime("");
        setTimerState(STOPPED);
        clearInterval(interval.current);
        setTimeRemaining(convertToSeconds(DEFAULT_TIME)); // reset to 5 minutes
        localStorage.removeItem(TIMER_KEY);
    };

    // Handle input change
    const handleInputChange = event => {
        const { value } = event.target;
        if (/^[0-9]+$/.test(value) || !value) {
            setInputTime(value);
            setTimeRemaining(convertToSeconds(value || DEFAULT_TIME));
        }
    };

    const handleComplete = () => {
        alert("Countdown is over!");
    };

    // Notify when timer is complete
    useEffect(() => {
        if (timeRemaining === 0 && timerState === ACTIVE) {
            handleStop();
            handleComplete();
        }
    }, [timeRemaining]);

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === " ") {
                if (timerState !== ACTIVE) {
                    handleStart();
                } else if (timerState === ACTIVE) {
                    handlePause();
                }
            } else if (event.key === "s") {
                event.preventDefault();
                if (timerState !== STOPPED) {
                    handleStop();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [timerState]);

    return (
        <div>
            <div>
                {timerState === ACTIVE || timerState === PAUSED ? (
                    <h1> {formatTime(timeRemaining)}</h1>
                ) : (
                    <input
                        className="timer-input"
                        autoFocus
                        type="text"
                        maxLength="6"
                        placeholder={DEFAULT_TIME}
                        value={inputTime}
                        onChange={handleInputChange}
                    />
                )}
            </div>
            <button className="start-btn" onClick={handleStart} disabled={timerState === ACTIVE}>
                {timerState === PAUSED ? "Resume" : "Start"}
            </button>
            <button className="pause-btn" onClick={handlePause} disabled={timerState !== ACTIVE}>
                Pause
            </button>
            <button className="reset-btn" onClick={handleStop} disabled={timerState === STOPPED}>
                Reset
            </button>
        </div>
    );
}

export default Timer;
