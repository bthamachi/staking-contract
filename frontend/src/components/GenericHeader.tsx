import React from "react";

type GenericHeaderProps = {
  text: string;
};

const GenericHeader = ({ text }: GenericHeaderProps) => {
  return (
    <h3 className="text-lg font-medium leading-6 text-gray-900">{text}</h3>
  );
};

export default GenericHeader;
