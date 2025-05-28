export default function SelectConValidacion({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  requerido = false,
  selectClassName = "",
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${selectClassName} ${
          error ? "border-red-500" : "border-gray-300"
        } shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      >
        <option value="">Seleccione una opción</option>
        {options.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
