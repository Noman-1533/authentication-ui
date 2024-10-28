import  { useState, ChangeEvent, FormEvent } from "react";

export interface FormField {
  fieldLabel: string;
  fieldType: string;
  fieldName: string; // Unique identifier for the field state
  placeholder?: string; // Optional placeholder customization
}

interface LoginProps {
  buttonColor: string;
  buttonSize: string;
  formField: FormField[];
  dispatchEvent: (event: CustomEvent) => void;
}

const LoginForm = ({
  buttonColor,
  buttonSize,
  formField,
  dispatchEvent,
}: LoginProps) => {
  // Initialize the state dynamically based on the formField array
  const initialState = formField.reduce((acc, field) => {
    acc[field.fieldName] = ""; // Initialize all fields with empty strings
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState<Record<string, string>>(initialState);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the relevant field dynamically
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check for empty required fields
    const emptyFields = formField.some((field) => !formData[field.fieldName]);
    if (emptyFields) {
      setError("All fields are required!");
      return;
    }
    setError("");

    // Dispatch custom event with form data
    const event = new CustomEvent("login-submit", {
      detail: formData,
      bubbles: true,
      composed: true,
    });
    dispatchEvent(event);
  };
console.log('form data=> ',formField)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {formField.map((item, index) => (
            <div key={`${item.fieldLabel}-${index}`}>
              <label className="block text-sm font-medium text-gray-600">
                {item.fieldLabel}
              </label>
              <input
                type={item.fieldType}
                name={item.fieldName}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={item.placeholder || `Enter your ${item.fieldLabel.toLowerCase()}`}
                value={formData[item.fieldName]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button
            type="submit"
            className={`font-semibold ${buttonSize} text-white ${buttonColor} rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginForm };
