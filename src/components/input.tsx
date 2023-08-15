const Input = ({ title, value, set, type }) => {
  return (
    <label className="flex flex-col gap-2">
      <div className="text-sm flex items-center gap-2">
        {title}
        <span className="text-red-500">*</span>
      </div>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        type={type}
        className="bg-gray-900 p-2 rounded-md focus:outline-none"
        required
      />
    </label>
  );
};

export default Input;
