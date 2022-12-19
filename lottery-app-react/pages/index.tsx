
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Loading from '../components/Loading';
import { ethers } from "ethers";

import { 
  useAddress,
  useContract, 
  useContractRead,
  useContractWrite,
  useDisconnect, 
  useMetamask
} from '@thirdweb-dev/react'
import Login from '../components/Login'
import { currency } from '../constants';
import CountdownTimer from '../components/CountdownTimer';
import toast from "react-hot-toast";


const Home: NextPage = () => {
  const address = useAddress(); 
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);

  const { contract } = useContract("0x15B1520C0E4982214b0224D2E1c4BC41f54C4De6");
  const { data:remainingTickets, isLoading } = useContractRead(contract, "RemainingTickets");    
  const { data:currentWinningReward } = useContractRead(contract, "CurrentWinningReward");  
  const { data:ticketPrice } = useContractRead(contract, "ticketPrice"); 
  const { data:ticketCommission} = useContractRead(contract, "ticketCommission"); 
  const { data:tickets } = useContractRead(contract, "getTickets");
  const { data:expiration } = useContractRead(contract, "expiration"); 

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")

  useEffect(() => {
    if(!tickets) return;

    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (
      ticketAddress === address ? total + 1 : total), 0 );
      setUserTickets(noOfUserTickets)

  }, [tickets, address])


  const handleClick = async () => {
    if (!ticketPrice) return ;

    
    const notification = toast.loading("Buying your tickets...");
    try {

      const data = await BuyTickets([
          {
            value: ethers.utils.parseEther(
              (Number(ethers.utils.formatEther(ticketPrice)) * quantity)
              .toString()
          ),
        }
      ]);
      
      toast.success("Tickets purchased successfully!", {
        id: notification,
      });

      console.info("Contract call success", data);


    } catch(err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", err); 
    }
  }


  if (isLoading) return (
    <Loading /> 
  )
  
  if (!address) return (<Login />)

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1">
        <Header /> 

        {/* Next draw area */}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start 
                        justify-center md:space-x-5"> 
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>

            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward && ethers.utils.formatEther
                    (currentWinningReward.toString())} {currency}
                </p>
              </div>

              <div className="stats">
                <h2 className="text-sm">Tickets Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            
              <div className="mt-5 mb-3">
                  <CountdownTimer /> 
              </div>

          </div>


          <div>
          
            <div className="stats-container space-y-2">
              <div className="stats-containter">
                <div className="flex justify-between items-center text-white pb-2">
                  <h2> Price per Ticket </h2>
                  <p>
                    {ticketPrice && ethers.utils.formatEther
                    (ticketPrice.toString())} {currency}
                  </p>
                </div>
                <div className="flex text-white items-cetner space-x-2 bg-[#091B18] border-[#004337] border p-4">
                  <p>TICKETS</p>
                  <input className="flex w-full bg-transparent text-right outline-none" 
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    />
                </div>

                <div className="space-y-2 mt-5">
                  <div className='flex items-center justify-between text-emerald-300 text-sm italic font-extrabold'>
                    <p>Total cost: </p>
                    <p>
                      {
                        ticketPrice && Number(
                          ethers.utils.formatEther(ticketPrice?.toString())
                        ) * quantity
                      }
                      {" "}{currency}
                    </p>
                  </div>

                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>Service Fees</p>
                    <p>
                      {ticketCommission && ethers.utils.formatEther
                      (ticketCommission.toString())} {currency}
                    </p>
                  </div>

                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>+ Network Fees</p>
                    <p>TBC</p>
                  </div>

                  <button 
                      disabled={
                        expiration?.toString() < Date.now().toString() ||
                        remainingTickets?.toNumber() === 0 }
                      onClick={handleClick}
                      className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5
                        rounded-md font-semibold text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 
                        disabled:text-gray-100 disabled:cursor-not-allowed"
                      >
                      Buy {quantity} tickets for {" "}
                        {ticketPrice &&
                          Number(ethers.utils.formatEther(ticketPrice.toString
                            ())) *
                              quantity}{" "}
                      {currency}
                  </button>
                </div>

                  

              </div>
                {userTickets > 0 && (
                  <div className="stats">
                    <p className="text-lg mb-2">you have {userTickets} Tickets in this draw</p>
                    <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                      {Array(userTickets)
                        .fill("")
                        .map((_, index) => (
                          <p key={index}
                          className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded flex flex-shrink-0 items-center justify-center text-xs italic"
                            >{index + 1}
                          </p>
                      ))}
                    </div>
                  </div>

                )}
            </div>
          </div>
        
        </div> 
      </div>

      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">
            <img
              className="h-10 w-10 filter hue-rotate opacity-20 rounded-full"
              src="https://i.imgur.com/4h7mAu7.png"
              alt=""
            />

            <p className='text-xs text-emerald-900 pl-5'>
                Disclaimer: This product is made for informational and educational purposes only.
                The content of this project are not intended to be used to lure gambling. Instead, 
                the information presented is meant for nothing mroe than learning and entertainment purposes.
                We are not liable for any losses that are incurred or problems that arise at online casinos or 
                elsewhere after the reading and consideration of this project. If you are gambling online utilizing
                this project, you are doing so completely at your own risk. Thank you
            </p>
      </footer>

    </div>
  )
}

export default Home
