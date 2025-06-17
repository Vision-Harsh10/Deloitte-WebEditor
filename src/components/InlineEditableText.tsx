/*
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createEditor, Descendant, Node, Editor, Transforms, Text, Range } from 'slate';
import { Slate, Editable, withReact, useSlate, RenderLeafProps } from 'slate-react';
import { Bold, Italic, Underline } from 'lucide-react';
import isHotkey from 'is-hotkey';
import { HexColorPicker } from 'react-colorful';
import { ReactEditor } from 'slate-react';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean; color?: string };

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
    Text: CustomText;
  }
}

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  tag?: keyof JSX.IntrinsicElements;
  placeholder?: string;
}

const HOTKEYS: Record<string, keyof CustomText> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const ToolbarButton = ({ format, icon }: { format: keyof CustomText; icon: React.ReactNode }) => {
  const editor = useSlate();
  const isActive = !!(Editor.marks(editor)?.[format as keyof Omit<CustomText, 'text'>]);
  return (
    <button
      type="button"
      onMouseDown={e => {
        e.preventDefault();
        if (isActive) Editor.removeMark(editor, format);
        else Editor.addMark(editor, format, true);
      }}
      aria-pressed={isActive}
      aria-label={format}
      style={{
        background: isActive ? '#e0f0ff' : 'none',
        border: 'none',
        borderRadius: 4,
        padding: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.2s',
        marginRight: 4,
      }}
    >
      {icon}
    </button>
  );
};

const ColorPickerButton = () => {
  const editor = useSlate();
  const [show, setShow] = useState(false);
  const color = Editor.marks(editor)?.color || '#000000';
  const savedSelection = useRef<Range | null>(null);

  const applyColor = (color: string) => {
    if (savedSelection.current) {
      Transforms.select(editor, savedSelection.current);
      ReactEditor.focus(editor as ReactEditor);
    }
    Editor.addMark(editor, 'color', color);
    setShow(false);
  };

  return (
    <div style={{ position: 'relative', marginRight: 4 }}>
      <button
        type="button"
        aria-label="Text color"
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          border: '1px solid #ccc',
          background: color,
          cursor: 'pointer',
        }}
        onMouseDown={e => {
          e.preventDefault();
          savedSelection.current = editor.selection ? { ...editor.selection } as Range : null;
          setShow(s => !s);
        }}
      />
      {show && (
        <div style={{ position: 'absolute', top: 30, left: 0, zIndex: 10 }}>
          <HexColorPicker color={color} onChange={applyColor} />
        </div>
      )}
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.color) children = <span style={{ color: leaf.color }}>{children}</span>;
  return <span {...attributes}>{children}</span>;
};

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  className = '',
  inputClassName = '',
  tag = 'span',
  placeholder = 'Type here...'
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [editing, setEditing] = useState(false);
  const initialSlateValue = (() => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [{ type: 'paragraph', children: [{ text: value }] }];
  })();
  const [internalValue, setInternalValue] = useState<Descendant[]>(initialSlateValue);
  const wasEditing = useRef(false);
  const selectionRef = useRef<Range | null>(null);

  // Save selection on change
  const handleSelectionChange = () => {
    if (editor.selection) {
      selectionRef.current = { ...editor.selection };
    }
  };

  // Sync value from props only when not editing
  React.useEffect(() => {
    if (!editing && !wasEditing.current) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setInternalValue(parsed);
          return;
        }
      } catch {}
      setInternalValue([{ type: 'paragraph', children: [{ text: value }] }]);
    }
    wasEditing.current = editing;
  }, [value, editing]);

  const handleChange = (newValue: Descendant[]) => {
    setInternalValue(newValue);
    onChange(JSON.stringify(newValue)); // Save as JSON
  };

  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const Tag = tag as keyof JSX.IntrinsicElements;

  // Pass selectionRef and restore logic to ToolbarButton
  const ToolbarButtonWithSelection = ({ format, icon }: { format: keyof CustomText; icon: React.ReactNode }) => {
    const editor = useSlate();
    const isActive = !!(Editor.marks(editor)?.[format as keyof Omit<CustomText, 'text'>]);
    return (
      <button
        type="button"
        onPointerDown={e => {
          e.preventDefault();
          // Restore selection before applying/removing mark
          if (selectionRef.current) {
            Transforms.select(editor, selectionRef.current);
            ReactEditor.focus(editor as ReactEditor);
          }
          if (isActive) Editor.removeMark(editor, format);
          else Editor.addMark(editor, format, true);
        }}
        aria-pressed={isActive}
        aria-label={format}
        style={{
          background: isActive ? '#e0f0ff' : 'none',
          border: 'none',
          borderRadius: 4,
          padding: 4,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.2s',
          marginRight: 4,
        }}
      >
        {icon}
      </button>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {editing ? (
        <Slate editor={editor} value={internalValue} onChange={handleChange}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4, background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 2 }}>
            <ToolbarButtonWithSelection format="bold" icon={<Bold size={18} />} />
            <ToolbarButtonWithSelection format="italic" icon={<Italic size={18} />} />
            <ToolbarButtonWithSelection format="underline" icon={<Underline size={18} />} />
            <ColorPickerButton />
          </div>
          <Editable
            className={`border-2 border-blue-400 bg-blue-100 rounded px-2 py-1 min-w-[100px] min-h-[32px] focus:outline-none ${inputClassName}`}
            style={{ fontSize: 20, fontFamily: 'inherit', display: 'inline-block' }}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            onBlur={() => setEditing(false)}
            onSelect={handleSelectionChange}
            onFocus={handleSelectionChange}
            onPaste={e => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              editor.insertText(text);
            }}
            onKeyDown={event => {
              Object.keys(HOTKEYS).forEach(hotkey => {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                  if (Editor.marks(editor)?.[mark as keyof Omit<CustomText, 'text'>]) Editor.removeMark(editor, mark);
                  else Editor.addMark(editor, mark, true);
                }
              });
              if (event.key === 'Enter' || event.key === 'Escape') {
                event.preventDefault();
                setEditing(false);
              }
            }}
            autoFocus
          />
        </Slate>
      ) : (
        <Slate editor={editor} value={internalValue} onChange={() => {}}>
          <Editable
            readOnly
            renderLeaf={renderLeaf}
            className={className}
            style={{ fontSize: 20, fontFamily: 'inherit', display: 'inline-block', minWidth: 100, minHeight: 32 }}
          />
          <span
            tabIndex={0}
            onClick={e => {
              e.stopPropagation();
              setEditing(true);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setEditing(true);
              }
            }}
            role="button"
            aria-label="Edit text"
            style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'transparent', cursor: 'pointer' }}
          />
        </Slate>
      )}
    </div>
  );
};

export default InlineEditableText;
*/
