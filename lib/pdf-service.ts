// lib/pdf-service.ts

// 1. Force Next.js to use the legacy build to bypass Webpack ESM crashes
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

// 2. Set the worker URL to match the exact version
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const getPDFText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // 3. Load the document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  
  // 4. Extract text page by page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str || '');
    fullText += strings.join(" ") + " ";
  }
  
  return fullText;
};