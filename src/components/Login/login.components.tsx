import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export interface FormField {
  fieldLabel: string;
  fieldType: string;
  fieldName: string;
  placeholder?: string;
  serverError?: string;
  defaultValue?: string | number | boolean;
  validators?: {
    type: string;
    value?: string | number | RegExp;
    message?: string;
  }[];
  dependsOn?: {
    fieldName: string;
    message: string;
  };
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

const CreateButtons = (
  buttons: ButtonModel[],
  isValid: boolean,
  isDirty: boolean
) => {
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
};

const LoginForm = ({
  formName,
  buttons,
  formField,
  dispatchEvent,
  rememberMe = false,
  isReset = false,
}: LoginProps) => {
  const [isRemembered, setIsRemembered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const defaultValues: FormValues = formField.reduce((acc, field) => {
    acc[field.fieldName] = field.defaultValue || "";
    return acc;
  }, {} as FormValues);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues,
    mode: "all",
  });

  console.log("current form data from library => ", formField);

  const CreateErrors = (message: string) => {
    console.log(message);
    return <div className="text-xs text-red-600 mt-1">{message}</div>;
  };
  const onSubmit = (values: FormValues) => {
    console.log("Original form values: ", values);
  
    try {
      const filteredValues = Object.keys(values).reduce((acc, fieldName) => {
        const field = formField.find((item) => item.fieldName === fieldName);
        if (field && field.dependsOn) {
          return acc;
        }
        acc[fieldName] = values[fieldName];
        return acc;
      }, {} as FormValues);
  
      console.log("Filtered form values (excluding dependsOn fields): ", filteredValues);
      const event = new CustomEvent("form-submit", {
        detail: { ...filteredValues, rememberMe: isRemembered },
        bubbles: true,
        composed: true,
      });
      console.log("event from library =>", event);
      dispatchEvent(event);
  
      if (isReset) {
        reset(defaultValues);
        setIsRemembered(false);
      }
      setIsSubmitted(true);
    } catch (e) {
      console.log("Error", e);
    }
  };
  
  const validateDependentField = (fieldName: string,  value: string | number | boolean | null) => {
    const dependentField = formField.find((field) => field.fieldName === fieldName);
    if (dependentField?.dependsOn) {
      const dependentValue = watch(dependentField.dependsOn.fieldName);
      if (dependentValue !== value) {
        return dependentField.dependsOn.message;
      }
    }
    return true;
  };
 
  useEffect(() => {
    if (!isSubmitted) {
      const updatedForm = formField.map((item) => ({
        ...item,
        serverError: "",
      }));
      formField = updatedForm;
      console.log("form field from effect => ", formField);
    }
  }, [isSubmitted]);

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

                      return validateDependentField(item.fieldName, value);
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
                  onInput={() => {
                    setIsSubmitted(false);
                  }}
                />

                {item.fieldType === "checkbox" && item.fieldLabel && (
                  <label className="ml-2 block text-sm text-gray-600">
                    {item.fieldLabel}
                  </label>
                )}
              </div>
              {isSubmitted &&
                item.serverError &&
                CreateErrors(item.serverError)}
              {errors[item.fieldName]?.message &&
                CreateErrors(String(errors[item.fieldName]?.message))}
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
