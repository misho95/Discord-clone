const Select = ({ data, value, set }) => {
  return (
    <select
      value={value}
      onChange={(e) => set(e.target.value)}
      className="bg-gray-900 p-2 rounded-md focus:outline-none w-full"
    >
      {data.map((e, index) => {
        return <option key={index}>{e}</option>;
      })}
    </select>
  );
};

export default Select;
