"use client";
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

type RichTextEditorProps = {
    value: string;
    onChange: (content: string) => void;
    placeholder: string;
};

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
    // const [editorValue, setEditorValue] = useState(value || '');

    const ReactQuill = useMemo(
        () =>
            dynamic(() => import('react-quill-new'), {
                ssr: false,
                loading: () => (
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                        <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                            <div className="h-7 w-24 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                            <div className="h-7 w-16 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                            <div className="h-7 w-20 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                            <div className="h-7 w-14 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                            <div className="h-7 w-14 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                            <div className="h-7 w-14 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                            <div className="h-7 w-14 animate-pulse rounded-md bg-[var(--color-surface-strong)]" />
                        </div>
                        <div className="space-y-3 p-4">
                            <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--color-surface-strong)]" />
                            <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--color-surface-strong)]" />
                            <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--color-surface-strong)]" />
                            <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--color-surface-strong)]" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-surface-strong)]" />
                        </div>
                    </div>
                )
            }),
        []
    );
    const modules = useMemo(() => ({
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }), []);

    const formats = [
        'font',
        'header',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'script',
        'list',
        'indent',
        'align',
        'blockquote',
        'code-block',
        'link',
        'image',
        // 'video'
    ];

    return (
        <div className='relative eshop-quill'>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                // value={editorValue}
                // onChange={(content) => {
                //     setEditorValue(content);
                //     onChange(content);
                // }}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
            />
            <style jsx global>{`
                .eshop-quill .ql-toolbar.ql-snow {
                    background: linear-gradient(135deg, var(--color-surface), var(--color-surface-muted));
                    border: 1px solid var(--color-border);
                    border-bottom: none;
                    border-radius: 12px 12px 0 0;
                    padding: 12px;
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
                }
                .eshop-quill .ql-formats {
                    margin: 2px
                }

                .eshop-quill .ql-container.ql-snow {
                    border: 1px solid var(--color-border);
                    border-radius: 0 0 12px 12px;
                    background: var(--color-surface);
                }

                .eshop-quill .ql-editor {
                    min-height: 260px;
                    color: var(--color-text);
                    font-size: 14px;
                    line-height: 1.7;
                    padding: 16px 18px;
                }

                .eshop-quill .ql-editor.ql-blank::before {
                    color: var(--color-text-muted);
                    font-style: normal;
                }

                .eshop-quill .ql-toolbar .ql-picker-label,
                .eshop-quill .ql-toolbar .ql-picker-item,
                .eshop-quill .ql-toolbar button {
                    color: var(--color-text);
                }

                .eshop-quill .ql-toolbar button:hover,
                .eshop-quill .ql-toolbar button:focus,
                .eshop-quill .ql-toolbar .ql-picker-label:hover,
                .eshop-quill .ql-toolbar .ql-picker-item:hover {
                    color: var(--color-accent);
                }

                .eshop-quill .ql-toolbar button.ql-active,
                .eshop-quill .ql-toolbar .ql-picker-label.ql-active,
                .eshop-quill .ql-toolbar .ql-picker-item.ql-selected {
                    color: var(--color-accent);
                }

                .eshop-quill .ql-toolbar .ql-stroke {
                    stroke: var(--color-text);
                }

                .eshop-quill .ql-toolbar button:hover .ql-stroke,
                .eshop-quill .ql-toolbar button:focus .ql-stroke,
                .eshop-quill .ql-toolbar button.ql-active .ql-stroke {
                    stroke: var(--color-accent);
                }

                .eshop-quill .ql-toolbar .ql-fill {
                    fill: var(--color-text);
                }

                .eshop-quill .ql-toolbar button:hover .ql-fill,
                .eshop-quill .ql-toolbar button:focus .ql-fill,
                .eshop-quill .ql-toolbar button.ql-active .ql-fill {
                    fill: var(--color-accent);
                }

                .eshop-quill .ql-toolbar .ql-picker-options {
                    background: var(--color-surface-strong);
                    border: 1px solid var(--color-border);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
                }

                .eshop-quill .ql-toolbar .ql-picker-item {
                    color: var(--color-text);
                }

                .eshop-quill .ql-toolbar .ql-picker-item:hover,
                .eshop-quill .ql-toolbar .ql-picker-item.ql-selected {
                    color: var(--color-accent);
                }

                .eshop-quill .ql-snow .ql-tooltip {
                    background: var(--color-surface-strong);
                    border: 1px solid var(--color-border);
                    color: var(--color-text);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
                    border-radius: 10px;
                }

                .eshop-quill .ql-snow .ql-tooltip input[type='text'] {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    color: var(--color-text);
                    border-radius: 8px;
                }

                .eshop-quill .ql-snow .ql-tooltip a {
                    color: var(--color-accent);
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;