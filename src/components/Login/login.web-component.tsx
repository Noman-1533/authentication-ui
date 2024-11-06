import  ReactDOM  ,{ Root } from "react-dom/client";
import { ButtonModel, FormField, LoginForm } from "./login.components";

class LoginWebComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private root: Root | null;
  private formField: FormField[] = [];
  private formName: string = "Custom Form";
  private buttonColor: string = "bg-blue-500";
  private buttonSize: string = "px-6 py-3";
  private buttonLabel: string = "Button";
  private buttonPosition: string = "left";
  private checkValidation: boolean = false;
  private buttons: ButtonModel[] = [];
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    `;
    this.shadowRoot?.appendChild(style);
    this.root = null;
  }
  static get observedAttributes() {
    return ["form-field", "form-name", "buttons"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue != newValue) {
      if (name === "form-field") {
        this.formField = JSON.parse(newValue);
      }
      if (name === "form-name") {
        this.formName = newValue;
      }
      if (name === "buttons") {
        this.buttons = JSON.parse(newValue);
        this.buttons = this.buttons.map((item) => {
          item.buttonColor = item.buttonColor || this.buttonColor;
          item.buttonLabel = item.buttonLabel || this.buttonLabel;
          item.buttonPosition = item.buttonPosition || this.buttonPosition;
          item.buttonSize = item.buttonSize || this.buttonSize;
          item.checkValidation = item.checkValidation || this.checkValidation;
          return item;
        });
      }
    }
    console.log(
      "name=> ",
      name,
      "oldValue=> ",
      oldValue,
      "new Value=> ",
      newValue
    );
    this.render();
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }
  private render() {
    if (!this.root) {
      this.root = ReactDOM.createRoot(this.shadow!);
    }
    console.log(
      "button color=> ",
      this.buttonColor,
      "\n button size",
      this.buttonSize,
      "\n form field",
      this.formField
    );
    this.root.render(
      <LoginForm
        formName={this.formName}
        buttons={this.buttons}
        dispatchEvent={(event: CustomEvent) => this.dispatchEvent(event)}
        formField={this.formField}
      />
    );
  }
}
customElements.define("custom-form", LoginWebComponent);
export { LoginWebComponent };