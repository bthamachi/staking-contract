import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { SellerWrapper } from "../context/SellerContext";
import { TokenWrapper } from "../context/TokenContext";
import { WalletWrapper } from "../context/Wallet";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletWrapper>
      <TokenWrapper>
        <SellerWrapper>
          <div className="bg-gray-900 pb-10">
            <Navbar />
            <ToastContainer />
            <Component {...pageProps} />
          </div>
        </SellerWrapper>
      </TokenWrapper>
    </WalletWrapper>
  );
}
