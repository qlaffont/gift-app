import clsx from 'clsx';
import React from 'react';

const sizeClassNames = {
  medium: 'py-2 px-5 text-base',
  small: 'py-1 px-3 text-sm',
  roundSmall: 'p-2 text-sm',
};

const variantClassNames = {
  primary: 'font-bold text-black bg-gray-100',
  warning: 'font-bold text-white bg-warning',
  info: 'text-white bg-info font-bold',
  success: 'text-white bg-success font-bold',
  error: 'text-white bg-error font-bold',
  discord: 'text-white bg-discord font-bold',
};

const iconVariantClassNames: Record<keyof typeof variantClassNames, string> = {
  primary: 'bg-black',
  info: 'bg-white',
  warning: 'bg-white',
  success: 'bg-white',
  error: 'bg-white',
  discord: 'bg-white',
};

const iconSizeClassNames: Record<keyof typeof sizeClassNames, string> = {
  medium: 'h-4 w-4',
  small: 'h-3 w-3',
  roundSmall: 'h-3 w-3',
};

export const Button: React.FC<{
  size?: keyof typeof sizeClassNames;
  variant?: keyof typeof variantClassNames;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  children?: JSX.Element | string;
  prefixIcon?: string;
  prefixIconClassName?: string;
  suffixIcon?: string;
  suffixIconClassName?: string;
  onClick?: React.MouseEventHandler<any>;
  onClickPrefix?: React.MouseEventHandler<any>;
  onClickSuffix?: React.MouseEventHandler<any>;
}> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  prefixIconClassName = '',
  suffixIconClassName = '',
  type = 'button',
  disabled = false,
  isLoading = false,
  children,
  prefixIcon,
  onClickPrefix,
  suffixIcon,
  onClickSuffix,
  ...props
}) => (
  <button
    className={clsx(
      'flex items-center justify-center gap-2',
      'rounded-md',
      variantClassNames[variant],
      sizeClassNames[size],
      'hover:opacity-60',
      disabled ? '!opacity-30' : '',
      className,
    )}
    disabled={disabled || isLoading}
    type={type}
    {...props}
  >
    {isLoading && (
      <div>
        <i
          className={clsx(
            'icon icon-refresh block animate-spin',
            iconSizeClassNames[size],
            iconVariantClassNames[variant],
          )}
        ></i>
      </div>
    )}
    {prefixIcon && (
      <div onClick={onClickPrefix}>
        <i
          className={clsx(
            'block',
            `${prefixIcon}`,
            iconVariantClassNames[variant],
            iconSizeClassNames[size],
            prefixIconClassName,
          )}
        ></i>
      </div>
    )}

    {children && <p>{children}</p>}

    {suffixIcon && (
      <div onClick={onClickSuffix}>
        <i
          className={clsx(
            'block',
            `${suffixIcon}`,
            iconVariantClassNames[variant],
            iconSizeClassNames[size],
            suffixIconClassName,
          )}
        ></i>
      </div>
    )}
  </button>
);
