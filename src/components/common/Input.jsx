function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          py-2.5
          text-sm
          text-slate-800
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-100
        "
      />
    </div>
  );
}

export default Input;