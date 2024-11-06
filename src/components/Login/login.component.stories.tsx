/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { LoginWebComponent } from "../Login/login.web-component";

export default {
  title: "Components/LoginWebComponent",
  component: LoginWebComponent as unknown,
  argTypes: {
    formName: { control: "text" },
    button1Label: { control: "text" },
    button1Color: { control: "color" },
    button1Size: { control: "text" },
    button1Position: { control: "radio", options: ["left", "center", "right"] },
    button1CheckValidation: { control: "boolean" },
    button2Label: { control: "text" },
    button2Color: { control: "color" },
    button2Size: { control: "text" },
    button2Position: { control: "radio", options: ["left", "center", "right"] },
    button2CheckValidation: { control: "boolean" },
    rememberMe: { control: "boolean" },
    formField: { control: "object" },
    buttons: { control: "object" },
  },
} as Meta;

const Template: StoryFn = (args: any) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.createElement("custom-form");

    // Map the args to buttons, creating the buttons array dynamically
    args.buttons = [
      {
        buttonLabel: args.button1Label,
        buttonColor: args.button1Color,
        buttonSize: args.button1Size,
        buttonPosition: args.button1Position,
        checkValidation: args.button1CheckValidation,
      },
      {
        buttonLabel: args.button2Label,
        buttonColor: args.button2Color,
        buttonSize: args.button2Size,
        buttonPosition: args.button2Position,
        checkValidation: args.button2CheckValidation,
      },
    ];

    element.setAttribute("form-name", args.formName);
    element.setAttribute("buttons", JSON.stringify(args.buttons));
    element.setAttribute("form-field", JSON.stringify(args.formField));
    element.setAttribute("remember-me", args.rememberMe ? "true" : "false");

    return () => {
      container.current?.removeChild(element);
    };
  }, [args]);

  return <div ref={container} />;
};

export const Default = Template.bind({});
Default.args = {
  formName: "Login",
  button1Label: "Login",
  button1Color: "bg-blue-500",
  button1Size: "px-6 py-3",
  button1Position: "center",
  button1CheckValidation: true,
  button2Label: "Reset",
  button2Color: "bg-red-500",
  button2Size: "px-4 py-2",
  button2Position: "left",
  button2CheckValidation: false,
  rememberMe: true,
  formField: [
    {
      fieldLabel: "Username",
      fieldType: "text",
      fieldName: "username",
      placeholder: "Enter your username",
      validators: [
        { type: "required", message: "Username is required" },
        { type: "minLength", value: 3, message: "Minimum 3 characters" },
      ],
    },
    {
      fieldLabel: "Password",
      fieldType: "password",
      fieldName: "password",
      placeholder: "Enter your password",
      validators: [
        { type: "required", message: "Password is required" },
        { type: "minLength", value: 6, message: "Minimum 6 characters" },
      ],
    },
  ],
  buttons: [
    {
      buttonLabel: "Sign In",
      buttonColor: "bg-green-500",
      buttonSize: "px-8 py-4",
      buttonPosition: "left",
      checkValidation: true,
    },
    {
      buttonLabel: "Cancel",
      buttonColor: "bg-gray-500",
      buttonSize: "px-4 py-2",
      buttonPosition: "right",
      checkValidation: false,
    },
  ],
};

export const CustomButtonStyle = Template.bind({});
CustomButtonStyle.args = {
  formName: "Login",
  button1Label: "Sign In",
  button1Color: "bg-green-500",
  button1Size: "px-8 py-4",
  button1Position: "left",
  button1CheckValidation: true,
  button2Label: "Cancel",
  button2Color: "bg-gray-500",
  button2Size: "px-4 py-2",
  button2Position: "right",
  button2CheckValidation: false,
  rememberMe: true,
  formField: [
    {
      fieldLabel: "Email",
      fieldType: "email",
      fieldName: "email",
      placeholder: "Enter your email",
      validators: [
        { type: "required", message: "Email is required" },
        { type: "email", message: "Invalid email format" },
      ],
    },
    {
      fieldLabel: "Password",
      fieldType: "password",
      fieldName: "password",
      placeholder: "Enter your password",
      validators: [
        { type: "required", message: "Password is required" },
        { type: "minLength", value: 8, message: "Minimum 8 characters" },
      ],
    },
  ],
  buttons: [
    {
      buttonLabel: "Sign In",
      buttonColor: "bg-green-500",
      buttonSize: "px-8 py-4",
      buttonPosition: "left",
      checkValidation: true,
    },
    {
      buttonLabel: "Cancel",
      buttonColor: "bg-gray-500",
      buttonSize: "px-4 py-2",
      buttonPosition: "right",
      checkValidation: false,
    },
  ],
};

export const LargeForm = Template.bind({});
LargeForm.args = {
  formName: "Sign Up",
  button1Label: "Register",
  button1Color: "bg-purple-500",
  button1Size: "px-10 py-4",
  button1Position: "right",
  button1CheckValidation: true,
  button2Label: "Cancel",
  button2Color: "bg-gray-500",
  button2Size: "px-4 py-2",
  button2Position: "left",
  button2CheckValidation: false,
  rememberMe: false,
  formField: [
    {
      fieldLabel: "Username",
      fieldType: "text",
      fieldName: "username",
      placeholder: "Enter your username",
      validators: [
        { type: "required", message: "Username is required" },
        { type: "minLength", value: 3, message: "Minimum 3 characters" },
      ],
    },
    {
      fieldLabel: "Email",
      fieldType: "email",
      fieldName: "email",
      placeholder: "Enter your email",
      validators: [
        { type: "required", message: "Email is required" },
        { type: "email", message: "Invalid email format" },
      ],
    },
    {
      fieldLabel: "Password",
      fieldType: "password",
      fieldName: "password",
      placeholder: "Enter your password",
      validators: [
        { type: "required", message: "Password is required" },
        { type: "minLength", value: 8, message: "Minimum 8 characters" },
      ],
    },
    {
      fieldLabel: "Confirm Password",
      fieldType: "password",
      fieldName: "confirmPassword",
      placeholder: "Confirm your password",
      validators: [
        { type: "required", message: "Confirmation is required" },
        { type: "minLength", value: 8, message: "Minimum 8 characters" },
      ],
    },
  ],
  buttons: [
    {
      buttonLabel: "Sign In",
      buttonColor: "bg-green-500",
      buttonSize: "px-8 py-4",
      buttonPosition: "left",
      checkValidation: true,
    },
    {
      buttonLabel: "Cancel",
      buttonColor: "bg-gray-500",
      buttonSize: "px-4 py-2",
      buttonPosition: "right",
      checkValidation: false,
    },
  ],
};
