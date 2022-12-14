import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Home() {
  return (
    <main>
      <div
        style={{
          height: "80vh",
        }}
        className=" pt-10 sm:pt-16 lg:pt-8 lg:pb-14"
      >
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto max-w-md px-4 sm:max-w-4xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
            <div className="lg:py-24">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-black p-1 pr-2 text-white hover:text-gray-200 sm:text-base lg:text-sm xl:text-base"
              >
                <span className="rounded-full bg-indigo-500 px-3 py-0.5 text-sm font-semibold leading-5 text-white">
                  Get Exclusive Access
                </span>
                <span className="ml-4 text-sm">
                  by minting your tokens today
                </span>
                <ChevronRightIcon
                  className="ml-2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </a>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                <span className="block">The Hamachi Coin</span>
                <span className="block text-indigo-400">
                  A new standard in digital innovation
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                We&apos;ve got new and improved tokenomics in store for the new
                token. Come by to check it out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
