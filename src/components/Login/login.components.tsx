
import { useForm } from "react-hook-form";
import { useState } from "react";

export interface FormField {
  fieldLabel: string;
  fieldType: string;
  fieldName: string;
  placeholder?: string;
  validators?: { type: string; value?: any; message?: string }[];
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
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",

  });

  const onSubmit = (values: Record<string, any>) => {
    try {
      const event = new CustomEvent("login-submit", {
        detail: values,
        bubbles: true,
        composed: true,
      });
      dispatchEvent(event);
      setTooltipMessage("Form submitted successfully!");
      reset();
    } catch (error) {
      setTooltipMessage("Submission failed. Please try again.");
    }

    setTimeout(() => setTooltipMessage(null), 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-6 relative bg-white border border-gray-300 shadow-lg p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

        {tooltipMessage && (
          <div className="absolute top-0 right-0 p-2 mt-2 mr-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow-md">
            {tooltipMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {formField.map((item, index) => (
            <div key={`${item.fieldLabel}-${index}`} className="flex flex-col">
              {item.fieldLabel && (
                <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
                  {item.fieldLabel}
                </label>
              )}
              <input
                type={item.fieldType}
                placeholder={item.placeholder || `Enter your ${item.fieldLabel?.toLowerCase()}`}
                {...register(item.fieldName, {
                  required: item.validators?.find((v) => v.type === "required")?.message ?? "This field is required",
                  minLength: {
                    value: item.validators?.find((v) => v.type === "minLength")?.value || 0,
                    message: item.validators?.find((v) => v.type === "minLength")?.message ?? "Minimum length not met",
                  },
                  maxLength: {
                    value: item.validators?.find((v) => v.type === "maxLength")?.value || 100,
                    message: item.validators?.find((v) => v.type === "maxLength")?.message ?? "Maximum length exceeded",
                  },
                  pattern: item.validators?.find((v) => v.type === "regex")?.value
                    ? {
                      value: new RegExp(item.validators?.find((v) => v.type === "regex")?.value as string),
                      message: item.validators?.find((v) => v.type === "regex")?.message ?? "Invalid format",
                    }
                    : undefined,
                  validate: (value) => {
                    if (
                      item.fieldType === "email" &&
                      item.validators?.some((v) => v.type === "email")
                    ) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      return emailRegex.test(value) || "Invalid email format";
                    }
                    return true;
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none transition-all duration-200 ${errors[item.fieldName]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-400"
                  }`}
              />
              {errors[item.fieldName]?.message && (
                <div className="text-xs text-red-600 mt-1">
                  {String(errors[item.fieldName]?.message)}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-2 mt-4 font-semibold ${buttonSize} text-white rounded-md transition-all duration-200 ${isValid && !isSubmitting
                ? `${buttonColor} hover:bg-green-600 focus:ring-2 focus:ring-green-400`
                : "bg-gray-400 cursor-not-allowed"
              }`}
              style={{
                backgroundColor: buttonColor
              }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginForm };
