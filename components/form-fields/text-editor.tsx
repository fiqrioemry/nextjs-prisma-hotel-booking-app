"use client";

import {
  Bold,
  Italic,
  List,
  Quote,
  Undo,
  Redo,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import React from "react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

interface TextEditorProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TextEditor({
  name,
  label,
  helperText,
  placeholder = "Start typing...",
  disabled,
  className,
}: TextEditorProps) {
  const { control, formState } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FieldWrapper
          name={name}
          label={label}
          helperText={helperText}
          error={formState.errors?.[name]?.message as string}
          className={className}
        >
          <TiptapEditor
            content={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            disabled={disabled}
          />
        </FieldWrapper>
      )}
    />
  );
}

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

function TiptapEditor({
  content,
  onChange,
  onBlur,
  placeholder,
  disabled,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 hover:text-primary/80",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false, // ✅ fix hydration error
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[80px] p-3",
      },
    },
  });

  const addLink = () => {
    const url = window.prompt("Enter the URL");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  const removeLink = () => {
    if (editor) editor.chain().focus().unsetLink().run();
  };

  // ✅ fallback jika editor belum siap
  if (!editor) {
    return (
      <div className="border border-input rounded-md p-3 text-sm text-muted-foreground bg-muted/30">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex items-center gap-1 flex-wrap bg-muted/20">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={editor.isActive("link") ? removeLink : addLink}
          data-active={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[80px] max-h-[200px] overflow-y-auto"
      />
    </div>
  );
}
