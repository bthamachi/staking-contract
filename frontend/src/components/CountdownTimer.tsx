import { fromUnixTime } from "date-fns";
import { useEffect, useState } from "react";

type CountdownTimerProps = {
  unlockTimestamp: number;
  redeemed: boolean;
};

const calculateRemainingTime = (timestamp: number) => {
  return timestamp - new Date().getTime();
};

const CountdownTimer = ({ unlockTimestamp, redeemed }: CountdownTimerProps) => {
  const unlockTime = fromUnixTime(unlockTimestamp).getTime();

  const [countdown, setCountdown] = useState(
    calculateRemainingTime(unlockTime)
  );

  useEffect(() => {
    if (unlockTime < new Date().getTime()) {
      return;
    }
    const interval = setInterval(() => {
      setCountdown(calculateRemainingTime(unlockTime));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (redeemed) {
    return null;
  }

  if (unlockTime < new Date().getTime()) {
    return (
      <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-blue-800">
        Ready To Redeem
      </span>
    );
  }

  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="flex flex-col items-end justify-end">
      <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-blue-800">
        Staked
      </span>
      <div className="text-xs mt-2">
        {hours.toLocaleString("en-US", { minimumIntegerDigits: 2 })} H{" "}
        {minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })} M to go
      </div>
    </div>
  );
};

export default CountdownTimer;
