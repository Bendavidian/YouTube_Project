import React from "react";

function Field(props) {
  // Handle change in input value
  const handleChange = (e) => {
    console.log(e.target.value); // Log input value
    props.onChange(props.name, e.target.value); // Call onChange prop with input name and value
  };

  return (
    <div className="form-group mb-3">
      <label className="form-label special-font">{props.name}</label>
      <input
        {...props}
        onChange={handleChange}
      />
    </div>
  );
}

export default Field;
