import React from 'react';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function richTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'], 
            [{ 'list': 'bullet' }, { 'list': 'ordered' }],
            ['clean']
        ],
    };

    return (
        <div className="relative w-full">
            <div className="overflow-hidden border border-emerald-100 rounded-2xl bg-blue-50/30">
                <ReactQuill 
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    placeholder={placeholder || "Tulis sesuatu..."}
                    className="bg-transparent"
                />
            </div>

            {/* Custom CSS untuk merapikan tampilan Tailwind & Quill */}
            <style>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid #ecfdf5 !important; /* emerald-100 */
                    background: #f8fafc; /* slate-50 */
                }
                .ql-container.ql-snow {
                    border: none !important;
                    min-height: 150px;
                    font-family: inherit;
                }
                .ql-editor {
                    font-size: 13px;
                    color: #1e293b; /* slate-800 */
                }
                /* Memastikan Bullet Points Muncul */
                .ql-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; }
                .ql-editor ol { list-style-type: decimal !important; padding-left: 1.5rem !important; }
                .ql-editor strong { font-weight: bold !important; }
            `}</style>
        </div>
    );
}