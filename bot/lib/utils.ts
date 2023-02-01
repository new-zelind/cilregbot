export function toCode(text: string): string {
  return `\`\`\`${text}\`\`\``;
}

export function toInline(text: string): string {
  return `\`${text}\``;
}

export function escape(text: string): string {
  return (text + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
}
