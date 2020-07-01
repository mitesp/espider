import React from "react";

// TODO consider replacing onChange with onBlur
// TODO: these functions should be cleaned up and refactored. currently they take too many args
function renderCustomInput(
  onChange: (e: React.FormEvent<HTMLInputElement>) => any,
  label: string,
  name: string,
  value: string,
  type: string,
  icon?: string,
  help?: string,
  disabled?: boolean
) {
  let className = "control";
  if (icon) {
    className += " has-icons-left";
  }
  return (
    <div className={className}>
      <input
        className="input"
        id={name}
        name={name}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        onBlur={onChange}
        disabled={disabled === true}
      />
      {icon && (
        <span className="icon is-small is-left">
          <i className={"fas fa-" + icon}></i>
        </span>
      )}
    </div>
  );
}

function renderLabeledInput(
  onChange: (e: React.FormEvent<HTMLInputElement>) => any,
  label: string,
  name: string,
  value: string,
  type: string,
  icon?: string,
  help?: string,
  disabled?: boolean
) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {renderCustomInput(onChange, label, name, value, type, icon, help, disabled)}
    </div>
  );
}

function renderLabeledSelect(
  onChange: (e: React.FormEvent<HTMLSelectElement>) => any,
  label: string,
  name: string,
  value: string,
  options: string[],
  icon?: string,
  help?: string
) {
  let className = "control";
  if (icon) {
    className += " has-icons-left";
  }
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className={className}>
        <div className="select is-normal is-expanded">
          <select
            id={name}
            name={name}
            value={value}
            placeholder={label}
            onChange={onChange}
            onBlur={onChange}
          >
            {options.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        {icon && (
          <span className="icon is-left">
            <i className={"fas fa-" + icon}></i>
          </span>
        )}
        {help && <p className="help"> {help} </p>}
      </div>
    </div>
  );
}

export { renderCustomInput, renderLabeledInput, renderLabeledSelect };
