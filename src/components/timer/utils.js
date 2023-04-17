// Convert seconds to HH:MM:SS format
export const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds - hours * 3600 - minutes * 60;
    return (
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds)
    );
};

export const padZeros = (str, n) => {
    let paddedStr = str;
    while (paddedStr.length < n) paddedStr = "0" + paddedStr;

    return paddedStr;
};

export const getTimeFromHHMMSS = timeString => {
    if (timeString.length < 6) {
        timeString = padZeros(timeString, 6);
    }
    const seconds = parseInt(timeString.slice(-2));
    const minutes = parseInt(timeString.slice(-4, -2));
    const hours = parseInt(timeString.slice(0, -4));

    return { hours, minutes, seconds };
};

// Convert time string to seconds
export const convertToSeconds = timeString => {
    const { hours, minutes, seconds } = getTimeFromHHMMSS(timeString);

    let totalSeconds = 0;
    if (Number(hours) > 99 || Number(minutes) > 59 || Number(seconds) > 59) {
        totalSeconds = Number(timeString);
    } else {
        totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    }

    return totalSeconds;
};
