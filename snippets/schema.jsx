import { useState } from "react";

export const Schema = ({ prompt, model = "qwen3-30b" }) => {
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const schema = JSON.stringify(
    {
      type: "object",
      properties: {
        summary: { type: "string" },
        confidence: { type: "number", minimum: 0, maximum: 1 }
      },
      required: ["summary", "confidence"],
      additionalProperties: false
    },
    null,
    2
  );

  const command = [
    'SCHEMA_FILE="$(mktemp)"',
    "cat > \"$SCHEMA_FILE\" <<'JSON'",
    schema,
    "JSON",
    `echo ${JSON.stringify(prompt)} | dottxt run -m ${model} -s "$SCHEMA_FILE"`,
    'rm "$SCHEMA_FILE"'
  ].join("\n");

  const copyValue = async (value) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch (_error) {
      // Ignore clipboard errors in unsupported environments.
    }
  };

  const handleCopy = async () => {
    await copyValue(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCopyCommand = async () => {
    await copyValue(command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 1200);
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="inline-flex items-center border-b-2 border-green-600 pb-1 text-sm font-semibold text-green-700 dark:text-green-400">
          CLI
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCommand}
            className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            {copiedCommand ? "Copied" : "Copy CLI Command"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">Model: {model}</div>
        <pre className="m-0 overflow-x-auto rounded-xl bg-zinc-100 p-3 text-xs text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
          <code>{command}</code>
        </pre>
      </div>
    </div>
  );
};
