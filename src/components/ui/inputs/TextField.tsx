'use client';

import React, { forwardRef } from 'react';

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  hideLabel?: boolean;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  rightSlot?: React.ReactNode;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      helperText,
      errorText,
      hideLabel = !!label,
      leftIcon,
      className,
      containerClassName,
      inputClassName,
      rightSlot,
      type = 'text',
      ...inputProps
    },
    ref,
  ) => {
    const inputId =
      id || inputProps.name || `tf-${Math.random().toString(36).slice(2)}`;

    const hasError = !!errorText;

    const labelClassName = `
      block text-sm font-medium text-text mb-1
      ${hideLabel ? 'sr-only' : ''}
    `;

    const wrapperClassName = `
      relative flex items-center rounded-xl border transition-colors
      bg-surface border-border text-text
      ${
        hasError
          ? 'ring-2 ring-brand/40 border-brand'
          : 'focus-within:ring-2 focus-within:ring-ring focus-within:border-brand'
      }
      ${className}
    `;

    const inputClass = `
      peer w-full bg-transparent outline-none
      placeholder:text-muted
      ${leftIcon ? 'px-3 py-2 pl-2' : 'px-3 py-2'}
      h-11 rounded-xl
      ${rightSlot ? 'pr-12' : ''}
      ${inputClassName}
    `;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
          </label>
        )}

        <div className={wrapperClassName}>
          {leftIcon && (
            <span className="pl-3 text-muted shrink-0">{leftIcon}</span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            spellCheck={false}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-help`
                  : undefined
            }
            className={inputClass}
            {...inputProps}
          />

          {rightSlot && (
            <div className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>

        {hasError ? (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-danger"
            aria-live="polite"
          >
            {errorText}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-help`} className="mt-1 text-xs text-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
export default TextField;
