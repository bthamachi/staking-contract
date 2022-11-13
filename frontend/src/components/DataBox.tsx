import ClipLoader from "react-spinners/ClipLoader";

type DataBoxProps = {
  name: string;
  stat: number | undefined;
  loading: boolean;
};

const DataBox = ({ name, stat, loading }: DataBoxProps) => {
  return (
    <div className="overflow-hidden text-center rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt className="truncate text-sm font-medium mb-4 text-gray-500">
        {name}
      </dt>
      {loading || typeof stat == "undefined" ? (
        <ClipLoader />
      ) : (
        <>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stat.toFixed(2).toString()}
          </dd>
        </>
      )}
    </div>
  );
};

export default DataBox;
