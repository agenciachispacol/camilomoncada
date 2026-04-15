"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
};

export default function NeonEditor({
  value,
  onChange,
  placeholder = "Escribe con estilo neon...",
  onImageUpload,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "neon-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "neon-prose min-h-[260px] max-w-none rounded-b-xl bg-ink-950/60 px-4 py-4 text-white focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[320px] animate-pulse rounded-xl border border-white/10 bg-white/[0.04]" />
    );
  }

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("URL:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addImage = async () => {
    if (onImageUpload) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (err: any) {
          alert(err?.message || "No se pudo subir la imagen");
        }
      };
      input.click();
    } else {
      const url = prompt("URL de la imagen:");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-950/40 focus-within:border-neon-cyan/60">
      <Toolbar editor={editor} onAddLink={addLink} onAddImage={addImage} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({
  editor,
  onAddLink,
  onAddImage,
}: {
  editor: Editor;
  onAddLink: () => void;
  onAddImage: () => void;
}) {
  const btn = (active: boolean, disabled?: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-all disabled:opacity-30 ${
      active
        ? "bg-gradient-to-br from-neon-pink/40 to-neon-cyan/40 text-white shadow-[0_0_12px_rgba(255,43,214,0.4)]"
        : "hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-gradient-to-r from-neon-pink/5 via-neon-purple/5 to-neon-cyan/5 p-1.5">
      <button
        type="button"
        aria-label="Negrita"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        aria-label="Cursiva"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <Italic size={14} />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button
        type="button"
        aria-label="H1"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={btn(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 size={14} />
      </button>
      <button
        type="button"
        aria-label="H2"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={btn(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 size={14} />
      </button>
      <button
        type="button"
        aria-label="H3"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={btn(editor.isActive("heading", { level: 3 }))}
      >
        <Heading3 size={14} />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button
        type="button"
        aria-label="Lista"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        <List size={14} />
      </button>
      <button
        type="button"
        aria-label="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
      >
        <ListOrdered size={14} />
      </button>
      <button
        type="button"
        aria-label="Cita"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive("blockquote"))}
      >
        <Quote size={14} />
      </button>
      <button
        type="button"
        aria-label="Código"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btn(editor.isActive("codeBlock"))}
      >
        <Code size={14} />
      </button>
      <button
        type="button"
        aria-label="Línea"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn(false)}
      >
        <Minus size={14} />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button
        type="button"
        aria-label="Enlace"
        onClick={onAddLink}
        className={btn(editor.isActive("link"))}
      >
        <LinkIcon size={14} />
      </button>
      <button
        type="button"
        aria-label="Imagen"
        onClick={onAddImage}
        className={btn(false)}
      >
        <ImageIcon size={14} />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button
        type="button"
        aria-label="Deshacer"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={btn(false, !editor.can().undo())}
      >
        <Undo2 size={14} />
      </button>
      <button
        type="button"
        aria-label="Rehacer"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={btn(false, !editor.can().redo())}
      >
        <Redo2 size={14} />
      </button>
    </div>
  );
}
