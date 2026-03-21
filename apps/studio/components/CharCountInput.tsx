import { TextArea } from "@sanity/ui";
import { set, unset, type StringInputProps, type TextOptions } from "sanity";
import { useCallback } from "react";

export interface CharCountTextOptions extends TextOptions {
  max?: number;
  rows?: number;
}

export function CharCountInput(props: StringInputProps) {
  const { value = "", onChange, elementProps, schemaType } = props;

  const options = schemaType?.options as CharCountTextOptions | undefined;

  const max = options?.max ?? 100;
  const rows = options?.rows ?? 3;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <div style={{ marginBottom: "-1.95rem", marginTop: "0" }}>
      <TextArea {...elementProps} value={value} onChange={handleChange} rows={rows} />
      <div
        style={{
          textAlign: "right",
          fontSize: "0.8em",
          padding: "0.5rem 0.5rem 0 0",
          color: value.length > max ? "#d4901b" : "#979cb0",
        }}
      >
        {value.length} / {max}
      </div>
    </div>
  );
}
