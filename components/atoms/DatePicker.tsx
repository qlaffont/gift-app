import clsx from 'clsx';
import { useMemo } from 'react';
//@ts-ignore
import DatePickerCmp from 'react-date-picker/dist/entry.nostyle';

import { useI18n } from '../../i18n/useI18n';
import { stringCharactersParser } from '../../services/string.utils';
import { translateErrorMessage } from '../../services/useYup';

export const DatePicker = ({
  value,
  onChange,
  label,
  error,
  helperText,
  required,
  className = '',
  minDate,
}: {
  value?: Date;
  label?: string;
  error?;
  className?: string;
  helperText?: string;
  required?: boolean;
  onChange: (date: Date) => void;
  minDate?: Date;
}) => {
  const { t, format, actualLang } = useI18n();

  const isError = useMemo(() => {
    return !!error;
  }, [error]);
  return (
    <div className={clsx(className, 'max-w-xl')}>
      {label && (
        <label className={clsx('block pb-1 text-black dark:text-white', isError ? ' !text-error' : '')}>
          {label}
          {required && <span> *</span>}
        </label>
      )}

      <div>
        <DatePickerCmp
          locale={actualLang === 'fr' ? 'fr-FR' : 'en-GB'}
          showLeadingZeros
          onChange={(date: Date) => {
            if (date === null || (date.getFullYear() + '').length !== 4) {
              onChange(null);
            }

            onChange(date);
          }}
          value={value}
          minDate={minDate}
        />
      </div>

      {(!!error || helperText) && (
        <p
          className={clsx(
            'mt-1 text-sm',
            isError ? '!border-error !text-error' : 'text-black text-opacity-80 dark:text-white',
          )}
          dangerouslySetInnerHTML={{
            __html: translateErrorMessage(error, t, format) || stringCharactersParser(helperText),
          }}
        ></p>
      )}
    </div>
  );
};
