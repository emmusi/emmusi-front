import Select from "react-select";

export default function SelectConFiltro({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  requerido = false,
  labelClassName = "",
  errorClassName = "text-red-500 text-xs italic",
  error,
}) {
  const mappedOptions = options.map((opt) => ({
    value: opt.id,
    label: opt.nombre,
  }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: error ? "#f56565" : "#cbd5e0",
      boxShadow: state.isFocused ? "0 0 0 1px #3182ce" : "",
      "&:hover": {
        borderColor: error ? "#f56565" : "#a0aec0",
      },
    }),
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={`${labelClassName}`}>
          {label} {requerido && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        inputId={id}
        name={name}
        value={mappedOptions.find((opt) => opt.value === value) || null}
        onChange={(selectedOption) => {
          const fakeEvent = {
            target: {
              id,
              value: selectedOption ? selectedOption.value : "",
            },
          };
          onChange(fakeEvent);
        }}
        options={mappedOptions}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder="Seleccione una opción"
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
