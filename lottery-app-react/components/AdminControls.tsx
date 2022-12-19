import React from 'react'

import {
    StarIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ArrowUturnDownIcon,
} from "@heroicons/react/24/solid"

import { 
    useContract, 
    useContractWrite,
    useContractRead,
  } from '@thirdweb-dev/react'

import { currency } from '../constants';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';



function AdminControls() {
    const { contract } = useContract(process.env.NEXT_PUBLIC_LOTTERY_KEY_CONTRACT_ADDRESS);

    const { data: totalCommission } = useContractRead(contract, "operatorTotalCommission"); 

    const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket");
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");


    const drawWinner = async () => {
        const notification = toast.loading("Picking a Lucky Winner...")

        try {
            const data = await DrawWinnerTicket([{}]);
            
            toast.success("A winner has been selected!", {
                id: notification
            });
            
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })
        }
    }

    const onWithdrawCommission = async () => {
        const notification = toast.loading("Withdrawing Commission...")

        try {
            const data = await WithdrawCommission([{}]);
            
            toast.success("Your commission has been successfully withdrawn", {
                id: notification
            });
            
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })

            console.error("contract call failure", err);
        }
    }

    const onRestartDraw = async () => {
        const notification = toast.loading("Restarting Draw..")

        try {
            const data = await restartDraw([{}]);
            
            toast.success("Draw restarted successfully", {
                id: notification
            });
            
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const onRefundAll = async () => {
        const notification = toast.loading("Refunding all...")

        try {
            const data = await RefundAll([{}]);
            
            toast.success("All refunded successfully...", {
                id: notification
            });
            
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            });

            console.error("contract call failure", err);
        }
    }



    return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
        <h2 className="font-bold">Admin Controls</h2>
        <p className="mb-5">Total Commision to be withdrawn: 
            {totalCommission && 
                ethers.utils.formatEther(totalCommission?.toString())}{" "}{currency}
        </p>
        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
            <button onClick={drawWinner} className="admin-button">
                <StarIcon className="h-6 mx-auto mb-2" />
                Draw Winner
            </button>

            <button onClick={onWithdrawCommission} className="admin-button">
                <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
                Withdraw Commision
            </button>

            <button onClick={onRestartDraw} className="admin-button">
                <ArrowPathIcon className="h-6 mx-auto mb-2" />
                Restart Draw
            </button>

            <button onClick={onRefundAll} className="admin-button">
                <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
                Refund All
            </button>
        </div>
    </div>
    )
}

export default AdminControls