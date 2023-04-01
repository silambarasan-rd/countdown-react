import React, {useCallback, useRef, useState} from 'react';
import './App.css';

const [STATUS_IDLE, STATUS_RUNNING, STATUS_PAUSED] = ['idle', 'running', 'paused'];

function App() {

  const [inputMinute, setInputMinute] = useState(0);
  const [inputSecond, setInputSecond] = useState(0);

  const [timer, setTimer] = useState({ minute: 0, second: 0 });
  const [timerStatus, setTimerStatus] = useState(STATUS_IDLE);

  const intervalRef = useRef<any>(undefined);

  const onMinuteChange = (e: any) => {
    setInputMinute(e.target.value);
  };

  const onSecondChange = (e: any) => {
    setInputSecond(e.target.value);
  };

  const onStart = () => {
    if (inputMinute === 0 && inputSecond === 0) {
      return;
    }

    if(intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let calculatedMins = +inputMinute + Math.floor(inputSecond / 60);
    let calculatedSecs = Math.floor(inputSecond % 60);

    setTimerStatus(STATUS_RUNNING);
    setTimer({ minute: calculatedMins, second: calculatedSecs });

    intervalRef.current = setInterval(() => {
      timerTicking();
    }, 1000);
  }

  const timerTicking = () => {
    setTimer((prevTimer) => {
      console.log('PREV TIMER: ', prevTimer);
      if ((prevTimer.minute > 0 && prevTimer.second > 0) || (prevTimer.minute < 1 && prevTimer.second > 0)) {
        return { ...prevTimer, second: prevTimer.second - 1 };
      } else if (prevTimer.minute > 0 && prevTimer.second < 1) {
        return { minute: prevTimer.minute - 1, second: 59 };
      } else {
        clearInterval(intervalRef.current);
        return prevTimer;
      }
    });
  }

  const onResumeOrPause = () => {
    setTimerStatus((prevStat) => {
      if(intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if(prevStat === STATUS_RUNNING) {
        return STATUS_PAUSED;
      } else if(prevStat === STATUS_PAUSED) {
        intervalRef.current = setInterval(() => {
          timerTicking();
        }, 1000);
        return STATUS_RUNNING;
      } else {
        return prevStat;
      }
    })
  }

  const onReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTimerStatus(STATUS_IDLE);
    setTimer({ minute: 0, second: 0 });
    setInputMinute(0);
    setInputSecond(0);
  }

  const padStr = (val: number): string => val.toString().padStart(2, '0');

  return (
    <div className="App">
      <h1>Countdown Timer</h1>

      <div>
        <form>
          <div>
            <label htmlFor="minutes">Minutes</label>
            <input type="number" min={0} value={inputMinute} onChange={onMinuteChange} id="minutes" />
          </div>
          <div>
            <label htmlFor="seconds">Seconds</label>
            <input type="number" min={0} value={inputSecond} onChange={onSecondChange} id="seconds" />
          </div>

          <div style={{ marginTop: '1.2em' }}>
            <button type="button" onClick={onStart}>Start</button>
            <button type="button" onClick={onResumeOrPause}>Resume/Pause</button>
            <button type="button" onClick={onReset}>Reset</button>
          </div>
        </form>
      </div>

      <div>
        <h1><span>{padStr(timer.minute)}</span>:<span>{padStr(timer.second)}</span></h1>
      </div>
    </div>
  );
}

export default App;
