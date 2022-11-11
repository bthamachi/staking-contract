import CoinPurchase from "../components/CoinPurchase";
import DataPoints from "../components/DataPoints";
import UserStakingHistory from "../components/UserStakingHistory";

const App = () => {
  return (
    <>
      <div className="max-w-5xl px-10 mx-auto">
        <DataPoints />
        <CoinPurchase />
        <UserStakingHistory />
      </div>
    </>
  );
};

export default App;
