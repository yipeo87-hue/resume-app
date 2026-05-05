import mammoth from "mammoth";
import { extractText } from "unpdf";

const SUPPORTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function getFileType(file: File): string | null {
  if (SUPPORTED_TYPES.includes(file.type)) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return null;
}

async function parsePdf(buffer: ArrayBuffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const result = await extractText(data);
  return result.text.join("\n");
}

async function parseDocx(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
  return result.value;
}

export async function parseFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileType = getFileType(file);

  if (fileType === "application/pdf") {
    return parsePdf(buffer);
  }
  if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return parseDocx(buffer);
  }
  throw new Error(`Unsupported file type: ${file.type || file.name}`);
}

export { SUPPORTED_TYPES };
