import React, { useEffect, useState } from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    convertFromRaw,
    convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useEditor } from "./tokencontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold,faCode,faItalic, faList, faListOl, faQuoteRight, faUnderline, } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@uiw/react-tooltip';

function showloading(){
    return (
        <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

function MyEditor({ date, toggle }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const { editorContent, setEditorContent } = useEditor();

    // Load initial content if it exists
    useEffect(() => {
        if (editorContent) {
            try {
                const rawContentFromDB = JSON.parse(editorContent); // Parse the JSON
                const contentState = convertFromRaw(rawContentFromDB); // Convert to Draft.js ContentState
                setEditorState(EditorState.createWithContent(contentState)); // Set initial editor state
            } catch (error) {
                console.error("Failed to parse content:", error);
                setEditorState(EditorState.createEmpty()); // Fallback to empty state
            }
        } else {
            console.warn("No content available, initializing empty editor.");
            setEditorState(EditorState.createEmpty());
        }
    }, [date, toggle]);

    useEffect(() => {
        // Convert editor content to raw content string
        const rawContent = convertToRaw(editorState.getCurrentContent());
        const rawContentString = JSON.stringify(rawContent);
        setEditorContent(rawContentString); // Update the context with the latest content
    }, [editorState, setEditorContent]);

    // Inline styles
    function onBoldClick() {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
    }
    function onItalicClick() {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
    }
    function onUnderlineClick() {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
    }
    function onCodeClick() {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "CODE"));
    }

    // Block styles
    function onHeaderOneClick() {
        setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
    }
    function onHeaderTwoClick() {
        setEditorState(RichUtils.toggleBlockType(editorState, "header-two"));
    }
    function onHeaderThreeClick() {
        setEditorState(RichUtils.toggleBlockType(editorState, "header-three"));
    }
    function onBlockquoteClick() {
        setEditorState(RichUtils.toggleBlockType(editorState, "blockquote"));
    }
    function onUnorderedListClick() {
        setEditorState(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
    }
    function onOrderedListClick() {
        setEditorState(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
    }

    // Handle key commands
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return "handled";
        }
        return "not-handled";
    };
    const blockStyleFn = (contentBlock) => {
        const type = contentBlock.getType();
        if (type === "header-one") {
            return "header-one";
        }
        if (type === "header-two") {
            return "header-two";
        }
        if (type === "header-three") {
            return "header-three";
        }
        if (type === "blockquote") {
            return "blockquote";
        }
        return null; // Default style
    };


    return (
        <div className="relative w-1/2 mx-auto p-4 border border-gray-300 rounded-md bg-white dark:bg-gray-900 dark:border-gray-700">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Inline Styles */}
                <Tooltip placement="top" content={"Bold"}>
                    <button
                        onClick={onBoldClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faBold} />
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Italic"}>
                    <button
                        onClick={onItalicClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 italic focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faItalic} />
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Underline"}>
                    <button
                        onClick={onUnderlineClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faUnderline} />
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Code"}>
                    <button
                        onClick={onCodeClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faCode} />
                    </button>
                </Tooltip>

                {/* Block Styles */}
                <Tooltip placement="top" content={"Header 1"}>
                    <button
                        onClick={onHeaderOneClick}
                        className="text-xl p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        H1
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Header 2"}>
                    <button
                        onClick={onHeaderTwoClick}
                        className="text-base p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        H2
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Header 3"}>
                    <button
                        onClick={onHeaderThreeClick}
                        className="text-sm p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        H3
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Quotes"}>
                    <button
                        onClick={onBlockquoteClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faQuoteRight} />
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Unordered List"}>
                    <button
                        onClick={onUnorderedListClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faList} />
                    </button>
                </Tooltip>

                <Tooltip placement="top" content={"Ordered List"}>
                    <button
                        onClick={onOrderedListClick}
                        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <FontAwesomeIcon icon={faListOl} />
                    </button>
                </Tooltip>
            </div>

            {/* Text editor */}
            <div className="border border-gray-200 rounded min-h-[300px] p-4 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <Editor
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={setEditorState}
                    placeholder="Write about your day..."
                    blockStyleFn={blockStyleFn}
                />
            </div>
        </div>
    );

}

export default MyEditor;
