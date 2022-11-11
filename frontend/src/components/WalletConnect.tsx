import { useRouter } from 'next/router'
import React from 'react'
import { useWalletContext } from '../context/Wallet'
import { formatAddressToDisplay } from '../utils/chain'



const WalletButton = () => {
    const {
        connectWallet,
        isConnected,
        disconnectWallet,
        address
    } = useWalletContext()

    const router = useRouter()


    if (isConnected) {
        return (<div >

            <button className="inline-flex items-center rounded-md border border-transparent  px-4 py-2 text-base font-medium text-white hover:underline" onClick={() => disconnectWallet()}
            >
                Disconnect Wallet {address ? `(${formatAddressToDisplay(address)})` : ""}
            </button>
            {router.route == "/" ? <button className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700" onClick={() => router.push("/app")}
            >Enter App</button> : null}

        </div>)
    }

    return (
        <div>
            <button
                className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
                onClick={() => connectWallet()}>Connect Wallet</button>
        </div>
    )
}

export default WalletButton