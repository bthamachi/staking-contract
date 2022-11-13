import { Popover } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const Navbar = () => {
  return (
    <Popover as="header" className="relative">
      <div className="bg-gray-900 pt-2">
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <Link href="/">
            <img
              className="hover:mouse-cursor h-20 w-auto"
              src="/Icon.png"
              alt=""
            />
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </Popover>
  );
};

export default Navbar;
