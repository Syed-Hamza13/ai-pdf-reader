import PDFParser from "pdf2json";

export async function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", pdfData => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.on("pdfParser_dataError", err => {
      reject(err);
    });

    pdfParser.loadPDF(filePath);
  });
}
