import React from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  onChange: (value: SelectOption | undefined) => void;
  value: SelectOption;
};

const Select = ({ value, onChange, options }: SelectProps) => {
  return <div></div>;
};

export default Select;
