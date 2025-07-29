export interface FormFieldOption {
  label: string;
  value: string;
}

export interface BaseFormField {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: Record<string, unknown>;
  width?: 'full' | 'half' | 'third' | 'two-thirds';
  helpText?: string;
}

export interface TextFormField extends BaseFormField {
  type: 'text' | 'email' | 'tel' | 'url';
}

export interface TextareaFormField extends BaseFormField {
  type: 'textarea';
  rows?: number;
}

export interface SelectFormField extends BaseFormField {
  type: 'select';
  options: FormFieldOption[];
}

export interface RadioFormField extends BaseFormField {
  type: 'radio';
  options: FormFieldOption[];
}

export interface CheckboxFormField extends BaseFormField {
  type: 'checkbox';
}

export interface HiddenFormField extends BaseFormField {
  type: 'hidden';
}

export interface HeadingFormField {
  type: 'heading';
  content: string;
}

export interface ParagraphFormField {
  type: 'paragraph';
  content: string;
}

export type FormField =
  | TextFormField
  | TextareaFormField
  | SelectFormField
  | RadioFormField
  | CheckboxFormField
  | HiddenFormField
  | HeadingFormField
  | ParagraphFormField;

export interface FormSettings {
  submitButton?: {
    text?: string;
    style?: 'primary' | 'secondary' | 'outline';
    position?: 'left' | 'center' | 'right';
  };
  redirectUrl?: string;
  successMessage?: string;
}

export type FormData = Record<string, unknown>;
