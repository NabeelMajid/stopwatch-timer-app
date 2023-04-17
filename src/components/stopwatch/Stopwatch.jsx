import React, { useState, useEffect } from "react";
import "./stopwatch.css";

const ACTIVE = "ACTIVE";
const PAUSED = "PAUSED";
const STOPPED = "STOPPED";

const ELAPSED_TIME_KEY = "elapsedTime";
const START_TIME_KEY = "startTime";
const LAPS_KEY = "laps";

const Stopwatch = () => {
    const [elapsedTime, setElapsedTime] = useState(localStorage.getItem(ELAPSED_TIME_KEY) || 0);
    const [startTime, setStartTime] = useState(null);
    const [laps, setLaps] = useState(JSON.parse(localStorage.getItem(LAPS_KEY) || "[]"));
    const [stopwatchState, setStopwatchState] = useState(STOPPED);

    useEffect(() => {
        let timer;
        if (startTime && stopwatchState === ACTIVE) {
            timer = setInterval(() => {
                setElapsedTime(Date.now() - Number(startTime));
                localStorage.setItem(ELAPSED_TIME_KEY, Date.now() - Number(startTime));
            }, 10);
        }
        return () => clearInterval(timer);
    }, [startTime, stopwatchState]);

    const handleStart = () => {
        if (stopwatchState !== ACTIVE) {
            setStartTime(Date.now() - elapsedTime);
            localStorage.setItem(START_TIME_KEY, Date.now() - elapsedTime);
        } else if (stopwatchState === PAUSED) {
            setStartTime(Date.now() - elapsedTime);
        }
        setStopwatchState(ACTIVE);
    };

    const handleStop = () => {
        setStopwatchState(STOPPED);
        setStartTime(null);
        setElapsedTime(0);
        setLaps([]);
        localStorage.removeItem(START_TIME_KEY);
        localStorage.removeItem(ELAPSED_TIME_KEY);
        localStorage.removeItem(LAPS_KEY);
    };

    const handlePause = () => {
        setStopwatchState(PAUSED);
    };

    const handleLap = () => {
        setLaps(laps => [...laps, elapsedTime]);
        localStorage.setItem(LAPS_KEY, JSON.stringify([...laps, elapsedTime]));
    };

    const formatTime = time => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(2);
        return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === " ") {
                if (stopwatchState !== ACTIVE) {
                    handleStart();
                } else if (stopwatchState === ACTIVE) {
                    handlePause();
                }
            } else if (event.key === "l") {
                if (stopwatchState === ACTIVE) {
                    handleLap();
                }
            } else if (event.key === "s") {
                event.preventDefault();
                if (stopwatchState !== STOPPED) {
                    handleStop();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [startTime, elapsedTime, stopwatchState]);

    return (
        <div>
            <h1>{formatTime(elapsedTime)}</h1>

            <button className="start-btn" disabled={stopwatchState === ACTIVE} onClick={handleStart}>
                {stopwatchState === PAUSED ? "Resume" : "Start"}
            </button>

            <button className="pause-btn" disabled={stopwatchState !== ACTIVE} onClick={handlePause}>
                Pause
            </button>

            <button className="reset-btn" disabled={stopwatchState === STOPPED} onClick={handleStop}>
                Stop
            </button>

            <button className="lap-btn" disabled={stopwatchState !== ACTIVE} onClick={handleLap}>
                Lap
            </button>

            {laps.length > 0 && (
                <div className="laps-container">
                    <span className="laps-heading">Laps</span>
                    <ol className="laps-ol">
                        {laps.map((lapTime, index) => (
                            <li key={index} className="laps-li">
                                {formatTime(lapTime)}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default Stopwatch;
