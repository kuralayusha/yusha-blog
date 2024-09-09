import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const EditorPage = () => {
  const [editorContent, setEditorContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');

  const handleExportToJson = () => {
    // Convert editor content to JSON format
    const jsonOutput = JSON.stringify({
      content: editorContent.split('\n').map(line => ({
        type: 'paragraph',
        text: line
      }))
    }, null, 2);
    setJsonContent(jsonOutput);
  };

  const handleImportFromJson = () => {
    try {
      const parsedContent = JSON.parse(jsonContent);
      if (parsedContent.content) {
        setEditorContent(parsedContent.content.map(item => item.text).join('\n'));
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
          <Textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="Write your blog content here..."
            className="min-h-[400px] mb-4"
          />
          <Button onClick={handleExportToJson}>Export to JSON</Button>
        </TabsContent>
        <TabsContent value="json">
          <Textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            placeholder="Paste JSON content here..."
            className="min-h-[400px] mb-4"
          />
          <Button onClick={handleImportFromJson}>Import from JSON</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorPage;