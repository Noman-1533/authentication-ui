
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { LoginWebComponent } from '../components/Login/login.web-component'; 

export default {
  title: 'Components/LoginWebComponent',
  component: LoginWebComponent as unknown,
  argTypes: {
    buttonColor: { control: 'color' },
    buttonSize: { control: 'text' },
    formField: { control: 'object' },
  },
} as Meta;

const Template: StoryFn = (args: any) => {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = document.createElement('custom-form');
    element.setAttribute('button-color', args.buttonColor);
    element.setAttribute('button-size', args.buttonSize);
    element.setAttribute('form-field', JSON.stringify(args.formField));
    container.current?.appendChild(element);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [args]);

  return <div ref={container} />;
};

export const Default = Template.bind({});
Default.args = {
  buttonColor: 'bg-blue-500',
  buttonSize: 'px-6 py-3',
  formField: [
    {
      fieldLabel: 'Username',
      fieldType: 'text',
      fieldName: 'username',
      placeholder: 'Enter your username',
      validators: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 3, message: 'Minimum 3 characters' },
      ],
    },
    {
      fieldLabel: 'Password',
      fieldType: 'password',
      fieldName: 'password',
      placeholder: 'Enter your password',
      validators: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 6, message: 'Minimum 6 characters' },
      ],
    },
  ],
};

export const CustomButtonStyle = Template.bind({});
CustomButtonStyle.args = {
  buttonColor: 'bg-green-500',
  buttonSize: 'px-8 py-4',
  formField: [
    {
      fieldLabel: 'Email',
      fieldType: 'email',
      fieldName: 'email',
      placeholder: 'Enter your email',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
      ],
    },
    {
      fieldLabel: 'Password',
      fieldType: 'password',
      fieldName: 'password',
      placeholder: 'Enter your password',
      validators: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Minimum 8 characters' },
      ],
    },
  ],
};
