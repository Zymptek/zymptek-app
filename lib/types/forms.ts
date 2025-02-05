export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'url';
  placeholder: string;
  required: boolean;
  options?: Array<{
    label: string;
    value: string;
    options?: Array<{
      label: string;
      value: string;
    }>;
  }>;
}