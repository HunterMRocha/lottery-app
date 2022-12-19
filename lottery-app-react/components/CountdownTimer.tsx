import React from 'react'
import { useContract, useContractRead } from "@thirdweb-dev/react";
import Countdown from "react-countdown";

type Props = {
    hours: number; 
    minutes: number;
    seconds: number; 
    completed: boolean;
}

function CountdownTimer() {
    const { contract } = useContract("0x15B1520C0E4982214b0224D2E1c4BC41f54C4De6");
    const { data:expiration } = useContractRead(contract, "expiration"); 

    const renderer = ({hours, minutes, seconds, completed }: Props) => {
        if (completed) {
            return (
                <div>
                    <h2 className="text-white text-xl text-center animate-bounce">
                        Tickets Sales have now CLOSED for this draw</h2>
                        <div>
                        <h3 className="text-white text-sm mb-2 italic" >Time Remaining</h3>
                        <div className="flex space-x-6">
                            <div className="flex-1">
                                <div className="countdown animate-pulse">{hours}</div>
                                <div className="countdown-label">hours</div>
                            </div>

                            <div className="flex-1">
                                <div className="countdown animate-pulse">{minutes}</div>
                                <div className="countdown-label">minutes</div>
                            </div>

                            <div className="flex-1">
                                <div className="countdown animate-pulse">{seconds}</div>
                                <div className="countdown-label">seconds</div>
                            </div>

                    </div>
                </div>
                </div> 
            )
        } else {
            return (
                <div>
                    <h3 className="text-white text-sm mb-2 italic" >Time Remaining</h3>
                    <div className="flex space-x-6">
                        <div className="flex-1">
                            <div className="countdown animate-pulse">{hours}</div>
                            <div className="countdown-label">hours</div>
                        </div>

                        <div className="flex-1">
                            <div className="countdown animate-pulse">{minutes}</div>
                            <div className="countdown-label">minutes</div>
                        </div>

                        <div className="flex-1">
                            <div className="countdown animate-pulse">{seconds}</div>
                            <div className="countdown-label">seconds</div>
                        </div>

                    </div>
                </div>

            )
        }
    }

    return (
        <div>
            <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
        </div>
    )
}

export default CountdownTimer