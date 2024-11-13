import { useForm } from "react-hook-form";
import { useState } from "react";

export interface FormField {
  fieldLabel: string;
  fieldType: string;
  fieldName: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  validators?: {
    type: string;
    value?: string | number | RegExp;
    message?: string;
  }[];
}

export interface ButtonModel {
  buttonLabel: string;
  buttonColor: string;
  buttonSize: string;
  buttonPosition: "left" | "center" | "right";
  checkValidation: boolean;
}

interface LoginProps {
  formName: string;
  buttons: ButtonModel[];
  formField: FormField[];
  dispatchEvent: (event: CustomEvent) => void;
  rememberMe?: boolean;
  isReset?: boolean;
}

type FormValues = Record<string, string | number | boolean | null>;

function CreateButtons(
  buttons: ButtonModel[],
  isValid: boolean,
  isDirty: boolean
) {
  const buttonList = buttons.map((item, index) => {
    let activeButtonColor = `${item.buttonColor} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`;
    if (item.checkValidation && (!isValid || !isDirty)) {
      activeButtonColor = "bg-gray-600 cursor-not-allowed";
    }
    const buttonPosition =
      item.buttonPosition === "center"
        ? "mx-auto "
        : item.buttonPosition === "right"
        ? "ml-auto "
        : "";

    return (
      <button
        key={`${item.buttonLabel}-${index}`}
        type="submit"
        disabled={!isValid || !isDirty}
        className={`font-semibold ${item.buttonSize} text-white rounded-md block
                    ${activeButtonColor} 
                    ${buttonPosition}`}
        style={{
          backgroundColor: item.buttonColor,
        }}
      >
        {item.buttonLabel}
      </button>
    );
  });
  return buttonList;
}

const LoginForm = ({
  formName,
  buttons,
  formField,
  dispatchEvent,
  rememberMe = false,
  isReset = false,
}: LoginProps) => {
  const [isRemembered, setIsRemembered] = useState(false);

  const defaultValues: FormValues = formField.reduce((acc, field) => {
    acc[field.fieldName] = field.defaultValue || "";
    return acc;
  }, {} as FormValues);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<FormValues>({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (values: FormValues) => {
    try {
      const event = new CustomEvent("form-submit", {
        detail: { ...values, rememberMe: isRemembered },
        bubbles: true,
        composed: true,
      });
      dispatchEvent(event);

      if (isReset) {
        reset(defaultValues);
        setIsRemembered(false);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-6 relative bg-white border border-gray-300 shadow-lg p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {formName}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {formField.map((item, index) => (
            <div
              key={`${item.fieldLabel}-${index}`}
              className={`flex flex-col ${
                item.fieldType === "checkbox"
                  ? "flex-row items-start space-x-2"
                  : ""
              }`}
            >
              <div
                className={`${
                  item.fieldType === "checkbox" ? "flex items-start" : ""
                }`}
              >
                {item.fieldType !== "checkbox" && item.fieldLabel && (
                  <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
                    {item.fieldLabel}
                  </label>
                )}

                <input
                  type={item.fieldType}
                  placeholder={
                    item.placeholder ||
                    `Enter your ${item.fieldLabel?.toLowerCase()}`
                  }
                  {...register(item.fieldName, {
                    required:
                      item.validators?.find((v) => v.type === "required")
                        ?.message ?? "This field is required",
                    minLength: {
                      value:
                        (item.validators?.find((v) => v.type === "minLength")
                          ?.value as number) || 0,
                      message:
                        item.validators?.find((v) => v.type === "minLength")
                          ?.message ?? "Minimum length not met",
                    },
                    maxLength: {
                      value:
                        (item.validators?.find((v) => v.type === "maxLength")
                          ?.value as number) || 100,
                      message:
                        item.validators?.find((v) => v.type === "maxLength")
                          ?.message ?? "Maximum length exceeded",
                    },
                    validate: (value) => {
                      if (
                        item.fieldType === "email" &&
                        item.validators?.some((v) => v.type === "email")
                      ) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value as string)) {
                          return "Invalid email format";
                        }
                      }

                      const regexValidators = item.validators?.filter(
                        (v) => v.type === "regex"
                      );
                      for (const regexValidator of regexValidators ?? []) {
                        const regexPattern = new RegExp(
                          regexValidator.value as string
                        );
                        if (!regexPattern.test(value as string)) {
                          return regexValidator.message;
                        }
                      }
                      return true;
                    },
                  })}
                  className={`${
                    item.fieldType === "checkbox"
                      ? "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      : "w-full px-4 py-2 border rounded-md focus:outline-none transition-all duration-200"
                  } ${
                    errors[item.fieldName]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  defaultValue={
                    item.defaultValue as string | number | undefined
                  }
                />

                {item.fieldType === "checkbox" && item.fieldLabel && (
                  <label className="ml-2 block text-sm text-gray-600">
                    {item.fieldLabel}
                  </label>
                )}
              </div>
              {errors[item.fieldName]?.message && (
                <div className="text-xs text-red-600 mt-1">
                  {String(errors[item.fieldName]?.message)}
                </div>
              )}
            </div>
          ))}

          {rememberMe && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={isRemembered}
                onChange={(e) => setIsRemembered(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-600"
              >
                Remember Me
              </label>
            </div>
          )}

          {CreateButtons(buttons, isValid, isDirty)}
        </form>
      </div>
    </div>
  );
};

export { LoginForm };
