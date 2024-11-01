// import  { useState, ChangeEvent, FormEvent } from "react";

// export interface FormField {
//   fieldLabel: string;
//   fieldType: string;
//   fieldName: string; // Unique identifier for the field state
//   placeholder?: string; // Optional placeholder customization
// }

// interface LoginProps {
//   buttonColor: string;
//   buttonSize: string;
//   formField: FormField[];
//   dispatchEvent: (event: CustomEvent) => void;
// }

// const LoginForm = ({
//   buttonColor,
//   buttonSize,
//   formField,
//   dispatchEvent,
// }: LoginProps) => {
//   // Initialize the state dynamically based on the formField array
//   const initialState = formField.reduce((acc, field) => {
//     acc[field.fieldName] = ""; // Initialize all fields with empty strings
//     return acc;
//   }, {} as Record<string, string>);

//   const [formData, setFormData] = useState<Record<string, string>>(initialState);
//   const [error, setError] = useState<string>("");

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value, // Update the relevant field dynamically
//     }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     // Check for empty required fields
//     const emptyFields = formField.some((field) => !formData[field.fieldName]);
//     if (emptyFields) {
//       setError("All fields are required!");
//       return;
//     }
//     setError("");

//     // Dispatch custom event with form data
//     const event = new CustomEvent("login-submit", {
//       detail: formData,
//       bubbles: true,
//       composed: true,
//     });
//     dispatchEvent(event);
//   };
// console.log('form data=> ',formField)
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
//         {error && (
//           <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
//             {error}
//           </div>
//         )}
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           {formField.map((item, index) => (
//             <div key={`${item.fieldLabel}-${index}`}>
//               <label className="block text-sm font-medium text-gray-600">
//                 {item.fieldLabel}
//               </label>
//               <input
//                 type={item.fieldType}
//                 name={item.fieldName}
//                 className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder={item.placeholder || `Enter your ${item.fieldLabel.toLowerCase()}`}
//                 value={formData[item.fieldName]}
//                 onChange={handleChange}
//               />
//             </div>
//           ))}
//           <button
//             type="submit"
//             className={`font-semibold ${buttonSize} text-white ${buttonColor} rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export { LoginForm };

import { useState, ChangeEvent, FormEvent } from "react";

export interface FormField {
  fieldLabel: string;
  fieldType: string;
  fieldName: string;
  placeholder?: string;
  validators?: string[];
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
  const initialState = formField.reduce((acc, field) => {
    acc[field.fieldName] = ""; // Initialize with empty strings
    return acc;
  }, {} as Record<string, string>);

  if (buttonColor) {
    console.log();
  }
  const [formData, setFormData] =
    useState<Record<string, string>>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>(initialState);
  const isFormInvalid = Object.keys(errors).length > 0;
  // Helper function to determine if a string is a valid regex pattern
  const isCustomValidators = (validatorName: string) => {
    return (
      validatorName !== "required" &&
      validatorName !== "email" &&
      validatorName !== "minLength:6"
    );
  };

  // Validate field based on the validators provided
  const validateField = (
    name: string,
    value: string,
    validators?: string[]
  ): string => {
    if (!validators) return "";

    for (const validator of validators) {
      if (isCustomValidators(validator)) {
        const regex = new RegExp(validator);
        console.log(
          "enter to regex with regex",
          regex,
          `\n regex test for value => ${value} result is `,
          regex.test(value)
        );
        if (!regex.test(value)) {
          console.log("regex error");
          return `${name} is invalid. from regex`;
        }
      } else {
        switch (validator) {
          case "required":
            if (!value.trim()) return `${name} is required. from required`;
            break;
          case "email": {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value))
              return "Invalid email format. from emails";
            break;
          }
          case "minLength:6":
            if (value.length < 6)
              return `${name} must be at least 6 characters. from length`;
            break;
          default:
            continue;
        }
      }
    }

    return ""; // No errors
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field and update the error state if needed
    const field = formField.find((f) => f.fieldName === name);
    const error = validateField(name, value, field?.validators);
    console.log("Error for => ", name, "is ", error);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[name] = error; // Set the error if validation fails
      } else {
        delete newErrors[name]; // Clear the error if the field is valid
      }
      return newErrors;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    formField.forEach((field) => {
      const error = validateField(
        field.fieldName,
        formData[field.fieldName],
        field.validators
      );
      console.log("error while submit => ", error);
      if (error) newErrors[field.fieldName] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Dispatch the custom event with valid form data
    const event = new CustomEvent("login-submit", {
      detail: formData,
      bubbles: true,
      composed: true,
    });
    dispatchEvent(event);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {formField.map((item, index) => (
            <div key={`${item.fieldLabel}-${index}`}>
              <label className="block text-sm font-medium text-gray-600">
                {item.fieldLabel}
              </label>
              <input
                min=""
                type={item.fieldType}
                name={item.fieldName}
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors[item.fieldName]! ? "border-red-500" : ""
                }`}
                placeholder={
                  item.placeholder ||
                  `Enter your ${item.fieldLabel.toLowerCase()}`
                }
                value={formData[item.fieldName]}
                onChange={handleChange}
              />
              {errors[item.fieldName]! && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[item.fieldName]}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isFormInvalid}
            className={`font-semibold ${buttonSize} text-white  rounded-md 
                        ${
                          isFormInvalid
                            ? "bg-gray-600 cursor-not-allowed"
                            : `${buttonColor} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`
                        }`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginForm };
