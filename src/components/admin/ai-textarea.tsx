"use client";

import { useState } from "react";
import AIAssistantButton from "./ai-assistant-button";

interface AiTextAreaProps {
  id: string;
  name: string;
  required?: boolean;
  rows?: number;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  type: "short_description" | "full_content";
}

export default function AiTextArea({
  id,
  name,
  required,
  rows,
  className,
  placeholder,
  defaultValue = "",
  type,
}: AiTextAreaProps) {
  const [text, setText] = useState(defaultValue);

  return (
    <div className="space-y-3">
      <AIAssistantButton
        currentText={text}
        type={type}
        onGenerated={(newText) => setText(newText)}
      />
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        className={className}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
