import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RainbowWrapper } from "../client";
import Navbar from "../components/Navbar";
import { SellerWrapper } from "../context/SellerContext";
import { TokenWrapper } from "../context/TokenContext";
import { WalletWrapper } from "../context/Wallet";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RainbowWrapper>
      <WalletWrapper>
        <TokenWrapper>
          <SellerWrapper>
            <div className="bg-gray-900 h-full pb-10 md:pb-20">
              <Navbar />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
              />
              <Component {...pageProps} />
            </div>
          </SellerWrapper>
        </TokenWrapper>
      </WalletWrapper>
    </RainbowWrapper>
  );
}
