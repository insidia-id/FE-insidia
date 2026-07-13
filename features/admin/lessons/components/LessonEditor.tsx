'use client';

import { useEffect } from 'react';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Bold, Heading1, Heading2, ImageIcon, Italic, List, ListOrdered, Quote, Redo, Save, SeparatorHorizontal, UnderlineIcon, Undo, Video } from 'lucide-react';
import Youtube from '@tiptap/extension-youtube';

const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+/;
function isYoutubeUrl(url: string) {
  return youtubeRegex.test(url);
}

type LessonEditorContent = {
  contentJson: string;
  contentHtml: string;
};

type LessonEditorProps = {
  initialContentJson?: string | null;
  initialContentHtml?: string | null;
  isSaving?: boolean;
  onSave?: (content: LessonEditorContent) => void;
  onChange?: (content: LessonEditorContent) => void;
  showSaveButton?: boolean;
};

export function LessonEditor({ initialContentJson, initialContentHtml, isSaving, onSave, onChange, showSaveButton = true }: LessonEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your lesson content here. Paste a YouTube URL to embed a video...',
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        allowFullscreen: true,
        inline: false,
        width: 840,
        height: 472,
        HTMLAttributes: {
          class: 'rounded-lg w-full aspect-video',
        },
      }),
    ],
    immediatelyRender: false,
    content: initialContentJson ? (JSON.parse(initialContentJson) as JSONContent) : initialContentHtml || '',
    onUpdate: ({ editor }) => {
      onChange?.({
        contentJson: JSON.stringify(editor.getJSON()),
        contentHtml: editor.getHTML(),
      });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none min-h-[300px] focus:outline-none p-6',
      },
      handlePaste(_, event) {
        const text = event.clipboardData?.getData('text/plain');

        if (!text || !isYoutubeUrl(text)) {
          return false;
        }

        editor
          ?.chain()
          .focus()
          .setYoutubeVideo({
            src: text,
          })
          .run();

        return true;
      },
    },
  });
  console.log(`Extensions: ${editor?.extensionManager.extensions.map((ext) => ext.name).join(', ')}`);
  useEffect(() => {
    if (!editor) return;

    const content = initialContentJson ? JSON.parse(initialContentJson) : initialContentHtml || '';
    editor.commands.setContent(content);
    console.log(`Editor commands: ${Object.keys(editor.commands).join(', ')}`);
  }, [editor, initialContentJson, initialContentHtml]);

  if (!editor) return null;

  const handleImageInsert = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleYoutubeInsert = () => {
    const url = window.prompt('YouTube URL');

    if (!url || !isYoutubeUrl(url)) {
      return;
    }

    editor
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: url,
      })
      .run();
  };
  const handleSave = () => {
    onSave?.({
      contentJson: JSON.stringify(editor.getJSON()),
      contentHtml: editor.getHTML(),
    });
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 p-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200' : ''}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200' : ''}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled>
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <SeparatorHorizontal className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleImageInsert}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleYoutubeInsert}>
          <Video className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="h-4 w-4" />
        </Button>
        {showSaveButton && (
          <Button type="button" size="sm" onClick={handleSave} disabled={isSaving} className="ml-auto">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
