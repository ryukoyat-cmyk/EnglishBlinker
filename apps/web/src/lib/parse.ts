import { z } from 'zod';

const CsvLineSchema = z.object({
  english: z.string().min(1),
  korean: z.string().min(1)
});

export function parseWordLines(input: string): {
  rows: { english: string; korean: string; orderNo: number }[];
  errors: string[];
} {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows: { english: string; korean: string; orderNo: number }[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const parts = line.split(',').map((part) => part.trim());
    const [english = '', korean = ''] = parts;

    const parsed = CsvLineSchema.safeParse({ english, korean });

    if (!parsed.success) {
      errors.push(`${index + 1}행 형식 오류: "${line}"`);
      return;
    }

    rows.push({ ...parsed.data, orderNo: rows.length + 1 });
  });

  return { rows, errors };
}
