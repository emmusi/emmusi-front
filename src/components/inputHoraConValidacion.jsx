export default function InputHoraConValidacion({
  id,
  name,
  label,
  value,
  onChange,
  requerido = false,
  inputClassName = "",
  labelClassName = "",
  errorClassName = "text-red-500 text-xs italic",
  error,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={`${labelClassName}`}>
          {label} {requerido && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type="time"
        value={value}
        onChange={onChange}
        className={`${inputClassName} ${
          error ? "border-red-500" : "border-gray-300"
        } shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
