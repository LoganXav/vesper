import {
  EditorProvider,
  EditorProviderProps,
  JSONContent,
} from "@tiptap/react";
import { forwardRef, ReactNode } from "react";

export interface EditorRootProps {
  children: ReactNode;
}

export type EditorContentProps = Omit<EditorProviderProps, "content"> & {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly initialContent?: JSONContent;
};

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  ({ children, initialContent, className, ...rest }, ref) => (
    <div className={className} ref={ref}>
      <EditorProvider {...rest} content={initialContent}>
        {children}
      </EditorProvider>
    </div>
  )
);

EditorContent.displayName = "EditorContent";
