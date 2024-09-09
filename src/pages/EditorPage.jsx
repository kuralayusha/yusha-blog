import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const addCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock({ language: codeLanguage }).run();
  };

  const languages = [
    'javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust',
    'swift', 'kotlin', 'php', 'ruby', 'scala', 'typescript', 'html', 'css',
    'sql', 'bash', 'powershell', 'markdown'
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Select onValueChange={(value) => editor.chain().focus().toggleHeading({ level: parseInt(value) }).run()}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Paragraph" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Paragraph</SelectItem>
          <SelectItem value="1">Heading 1</SelectItem>
          <SelectItem value="2">Heading 2</SelectItem>
          <SelectItem value="3">Heading 3</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
      <Button onClick={() => editor.chain().focus().toggleCode().run()}>Inline Code</Button>
      <Input
        type="color"
        onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color}
      />
      <Input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button onClick={addImage}>Add Image</Button>
      <Select value={codeLanguage} onValueChange={setCodeLanguage}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={addCodeBlock}>Add Code Block</Button>
    </div>
  );
};

const EditorPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [jsonContent, setJsonContent] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      Color,
      TextStyle,
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
      }),
    ],
    content: '<p>Start writing your blog here...</p>',
  });

  const handleExportToJson = () => {
    const jsonOutput = JSON.stringify({
      title,
      author,
      date: new Date().toISOString().split('T')[0],
      content: {
        type: 'doc',
        content: editor.getJSON().content,
      },
    }, null, 2);
    setJsonContent(jsonOutput);
  };

  const handleImportFromJson = () => {
    try {
      const parsedContent = JSON.parse(jsonContent);
      if (parsedContent.content) {
        setTitle(parsedContent.title || '');
        setAuthor(parsedContent.author || '');
        editor.commands.setContent(parsedContent.content);
      }
    } catch (error) {
      console.error('Invalid JSON format', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog Editor</h1>
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <Input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <Input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mb-4"
          />
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="border p-4 min-h-[400px] mb-4" />
          <Button onClick={handleExportToJson}>Export to JSON</Button>
        </TabsContent>
        <TabsContent value="json">
          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            placeholder="Paste JSON content here..."
            className="w-full h-[400px] p-2 border rounded mb-4"
          />
          <Button onClick={handleImportFromJson}>Import from JSON</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorPage;