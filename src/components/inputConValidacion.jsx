export default function InputConValidacion({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  requerido = false,
  validacion,
  inputProps = {},
  maxLength,
  inputClassName = "", 
  labelClassName = "", 
  errorClassName = "text-red-500 text-xs italic", 
  error,
  disabled = false, // Nuevo prop
}) {
  const validar = (value) => {
    if (validacion === "numero" && !/^\d*$/.test(value)) return false;
    if (validacion === "texto" && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return false;
    if (validacion === "alfanumerico" && !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return false;
    if (validacion === "ciclo" && !/^[I0-9-\s]*$/.test(value)) return false;
    return true;
  };

  const handleOnChange = (e) => {
    if (!disabled && validar(e.target.value)) { // Evita cambios si está deshabilitado
      onChange(e);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className={`${labelClassName}`} htmlFor={id}>
          {label} {requerido && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled} // Aplicar el prop
        className={`${inputClassName} ${error ? "border-red-500" : "border-gray-300"} disabled:bg-gray-200 disabled:cursor-not-allowed`}
        {...inputProps}
      />
      {error && <p className={`${errorClassName}`}>{error}</p>}
    </div>
  );
}

