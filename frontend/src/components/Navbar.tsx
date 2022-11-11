import { Popover } from "@headlessui/react";
import { useWalletContext } from "../context/Wallet";
import WalletButton from "./WalletConnect";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

const Navbar = () => {
  const { updateUserAddress } = useWalletContext();
  if (typeof window != "undefined") {
    window?.ethereum.on("accountsChanged", async function (accounts) {
      //Initialise Information
      updateUserAddress(accounts[0]);
    });
  }

  return (
    <Popover as="header" className="relative">
      <div className="bg-gray-900 pt-2">
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <img className="h-20 w-auto" src="/Icon.png" alt="" />
          <WalletButton />
        </nav>
      </div>
    </Popover>
  );
};

export default Navbar;
