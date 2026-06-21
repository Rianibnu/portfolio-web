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
  value?: string;
  onChange?: (val: string) => void;
  type: "short_description" | "full_content";
  context?: "project" | "blog";
}

export default function AiTextArea({
  id,
  name,
  required,
  rows,
  className,
  placeholder,
  defaultValue = "",
  value,
  onChange,
  type,
  context = "project",
}: AiTextAreaProps) {
  const [internalText, setInternalText] = useState(defaultValue);

  const isControlled = value !== undefined;
  const currentText = isControlled ? value : internalText;

  const handleChange = (newText: string) => {
    if (!isControlled) {
      setInternalText(newText);
    }
    if (onChange) {
      onChange(newText);
    }
  };

  return (
    <div className="space-y-3">
      <AIAssistantButton
        currentText={currentText}
        type={type}
        context={context}
        onGenerated={(newText) => handleChange(newText)}
      />
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        className={className}
        placeholder={placeholder}
        value={currentText}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
