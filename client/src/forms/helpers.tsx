import React from "react";

// TODO consider replacing onChange with onBlur

function customInput(
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

function labeledInput(
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
      {customInput(onChange, label, name, value, type, icon, help, disabled)}
    </div>
  );
}

function labeledSelect(
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

export { customInput, labeledInput, labeledSelect };
