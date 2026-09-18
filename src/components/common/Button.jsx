function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-lg
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition
        duration-200
        hover:from-indigo-700
        hover:to-violet-700
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;