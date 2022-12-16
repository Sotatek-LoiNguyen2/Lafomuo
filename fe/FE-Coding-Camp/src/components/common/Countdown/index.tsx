import React from "react";
import Countdown from "react-countdown";

const Completionist = () => <span>Checkpoint end at: </span>;

const renderer = ({ hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return <Completionist />;
  } else {
    return (
      <span>
        {hours > 0 ? `${hours} ${hours > 1 ? "hours : " : "hour : "}` : ""}
        {minutes > 0
          ? `${minutes} ${minutes > 1 ? "minutes : " : "minute : "}`
          : ""}
        {seconds > 0 ? `${seconds} ${seconds > 1 ? "seconds" : "second"}` : ""}
      </span>
    );
  }
};

const CountdownCustom = ({ time, onCompleted }: any) => {
  return <Countdown date={time} renderer={renderer} onComplete={onCompleted} />;
};

export default CountdownCustom;
