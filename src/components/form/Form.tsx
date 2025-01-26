import React, { useState } from "react";
import "./Form.css";

interface Field {
  label: string;
  name: string;
  type: string;
}

interface FormProps {
  btnTitle: string;
  fields: Field[];
  onSuccess: (formData: Record<string, string>) => void;
  formData: any;
  setFormData: any;
}

const Form: React.FC<FormProps> = ({
  btnTitle,
  fields,
  onSuccess,
  formData,
  setFormData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value    
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="add-task-btn">
        {btnTitle}
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{btnTitle}</h2>
              <button onClick={closeModal} className="close-button">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {fields.map((field) => (
                <div key={field.name} className="form-group">
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              ))}
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
