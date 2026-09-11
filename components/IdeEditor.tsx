"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
      Initialising Monaco Code Studio...
    </div>
  ),
});

export default function IdeEditor(props: EditorProps) {
  return <MonacoEditor {...props} />;
}
