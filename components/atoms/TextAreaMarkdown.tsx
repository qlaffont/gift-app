import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { draftjsToMd, mdToDraftjs } from 'draftjs-md-converter';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

import clsx from 'clsx';
import { Controller } from 'react-hook-form';
import { useIsClient } from 'usehooks-ts';

export const TextAreaMarkdown = ({
  name,
  control,
  required = false,
  label,
  error,
  className,
  helperText,
  disabled,
  ...props
}: {
  name: string;
  control;
  required?: boolean;
  label?: string;
  error?;
  className?: string;
  helperText?: string;
  disabled?: boolean;
}) => {
  const isBrowser = useIsClient();

  if (!isBrowser) {
    return <></>;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, value, ...fieldProps } }) => {
        return (
          <div className={clsx(className, 'max-w-xl')}>
            {label && (
              <p className={clsx('block pb-2', error ? '!text-error' : 'text-black dark:text-white')}>
                {required ? `${label} *` : label}
              </p>
            )}
            <div className="border-dark-10 focus-within:border-dark-30 rounded-md border">
              <Editor
                //@ts-ignore
                defaultEditorState={
                  value ? EditorState.createWithContent(convertFromRaw(mdToDraftjs(value))) : undefined
                }
                //@ts-ignore
                onEditorStateChange={(data) => {
                  const rawContentState = convertToRaw(data.getCurrentContent());
                  const markdownResult = draftjsToMd(rawContentState);
                  onChange(markdownResult);
                }}
                ref={ref}
                toolbar={{
                  options: ['inline', 'list', 'link', 'emoji'],
                  inline: {
                    options: ['bold', 'italic', 'underline'],
                  },
                }}
                editorClassName="m-3 !h-[100px]"
                {...fieldProps}
                {...props}
              />
            </div>
            <div className={clsx(disabled ? '!cursor-not-allowed opacity-50' : '')}></div>
            {(!!error || helperText) && (
              <p className={clsx('mt-1 text-sm', error ? '!border-error !text-error' : 'text-dark-60')}>
                {error || helperText}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
