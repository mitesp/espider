import React from "react";
import { PronounOptions, pronounHelperText } from "../constants";

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
  help?: string
) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {renderCustomInput(onChange, label, name, value, type, icon, help, false)}
    </div>
  );
}

function renderDisabledLabeledInput(
  onChange: (e: React.FormEvent<HTMLInputElement>) => any,
  label: string,
  name: string,
  value: string,
  type: string,
  icon?: string,
  help?: string
) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {renderCustomInput(onChange, label, name, value, type, icon, help, true)}
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

function renderFirstLastName(
  onChange: (e: React.FormEvent<HTMLInputElement>) => any,
  firstNameValue: string,
  lastNameValue: string
) {
  return (
    <div className="field">
      <label className="label">Student Name</label>
      <div className="field is-horizontal">
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded">
              {renderCustomInput(
                onChange,
                "First Name",
                "firstName",
                firstNameValue,
                "text",
                "user"
              )}
            </div>
          </div>
          <div className="field">
            <div className="control is-expanded">
              {renderCustomInput(onChange, "Last Name", "lastName", lastNameValue, "text", "user")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderStandardFormSelect(
  type: string,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => any,
  value: string
) {
  switch (type) {
    case "pronouns":
      return renderLabeledSelect(
        onChange,
        "Pronouns",
        "pronouns",
        value,
        PronounOptions,
        "transgender-alt",
        pronounHelperText
      );
    default:
      break;
  }
}

function renderStandardFormField(
  type: string,
  onChange: (e: React.FormEvent<HTMLInputElement>) => any,
  value: string
) {
  switch (type) {
    case "username":
      return renderLabeledInput(onChange, "Username", "username", value, "text", "user");
    case "password":
      return renderLabeledInput(onChange, "Password", "password", value, "password", "lock");
    case "email":
      return renderLabeledInput(onChange, "E-mail", "email", value, "email", "envelope");
    case "phone":
      return renderLabeledInput(onChange, "Phone Number", "phoneNumber", value, "tel", "phone");
    case "city":
      return renderLabeledInput(onChange, "City", "city", value, "text", "city");
    case "state":
      return renderLabeledInput(onChange, "State", "state", value, "text", "compass");
    case "country":
      return renderLabeledInput(onChange, "Country", "country", value, "text", "globe");
    case "dob":
      return renderDisabledLabeledInput(
        onChange,
        "Date of Birth",
        "dateOfBirth",
        value,
        "date",
        "birthday-cake"
      );
    case "gradyear":
      return renderDisabledLabeledInput(
        onChange,
        "High School Graduation Year",
        "gradYear",
        value,
        "number",
        "graduation-cap"
      );
    case "school":
      return renderLabeledInput(
        onChange,
        "Current School",
        "school",
        value,
        "text",
        "chalkboard-teacher"
      );
    case "affiliation":
      break;
    default:
      break;
  }
}

export {
  renderCustomInput,
  renderLabeledInput,
  renderLabeledSelect,
  renderFirstLastName,
  renderStandardFormField,
  renderStandardFormSelect,
};
