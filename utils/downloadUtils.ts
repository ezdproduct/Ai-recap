import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, BorderStyle } from 'docx';
import TurndownService from 'turndown'; // Import TurndownService
import { ActiveView } from '../types';
import { RECAP_TEMPLATE } from '../components/RecapDisplay';
import { getCurrentDateFormatted } from './dateUtils'; // Import the new utility

interface DownloadContentOptions {
  filename: string;
  format: 'txt' | 'pdf' | 'docx' | 'md';
  activeView: ActiveView;
  transcription: string;
  recap: string;
  joditContent: string;
  setError: (error: string | null) => void;
}

export const downloadContent = async ({
  filename,
  format,
  activeView,
  transcription,
  recap,
  joditContent,
  setError,
}: DownloadContentOptions) => {
  let content = '';
  let isHtml = false;

  if (activeView === ActiveView.Transcript) {
    content = transcription;
    isHtml = false;
  } else {
    content = recap || joditContent || RECAP_TEMPLATE;
    isHtml = true;
  }

  // Replace date placeholder in content if it's HTML and contains the placeholder
  if (isHtml && content.includes('[YYYY-MM-DD]')) {
    content = content.replace('[YYYY-MM-DD]', getCurrentDateFormatted());
  }

  if (format === 'pdf') {
    if (isHtml) {
      const printable = document.createElement('div');
      printable.innerHTML = content;
      printable.className = 'prose';
      printable.style.width = '190mm'; // A4 width minus margins
      printable.style.padding = '10mm'; // Padding for content inside
      printable.style.position = 'absolute';
      printable.style.left = '-9999px'; // Hide from view
      printable.style.fontFamily = "'Be Vietnam Pro', sans-serif";
      document.body.appendChild(printable);

      html2canvas(printable, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm

        const margin = 10; // 10mm margin on each side
        const contentWidth = pdfWidth - 2 * margin;
        const contentHeight = pdfHeight - 2 * margin; // Usable height per PDF page

        const imgRatio = imgHeight / imgWidth;
        const renderedImgHeight = contentWidth * imgRatio; // Height of the image if scaled to fit contentWidth

        let heightLeft = renderedImgHeight;
        let position = 0; // Y position on the canvas to start drawing from

        // Add first page
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, renderedImgHeight);
        heightLeft -= contentHeight;

        // Add subsequent pages if content overflows
        while (heightLeft > 0) {
          position -= contentHeight; // Move up the canvas for the next page
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, renderedImgHeight);
          heightLeft -= contentHeight;
        }

        document.body.removeChild(printable);
        pdf.save(`${filename}.pdf`);
      }).catch(err => {
        console.error('Error generating PDF from HTML:', err);
        setError('An error occurred while generating the PDF file from HTML.');
      });
    } else {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 10, 10);
      doc.save(`${filename}.pdf`);
    }
  } else if (format === 'docx') {
    try {
      const docChildren: (Paragraph | Table)[] = [];

      if (isHtml) {
        const parser = new DOMParser();
        const docHtml = parser.parseFromString(content, 'text/html');
        const body = docHtml.body;

        body.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            docChildren.push(new Paragraph({ children: [new TextRun(node.textContent.trim())] }));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.tagName === 'H2') {
              docChildren.push(new Paragraph({
                children: [new TextRun({ text: element.textContent || '', bold: true })],
                heading: HeadingLevel.HEADING_2,
              }));
            } else if (element.tagName === 'H3') {
              docChildren.push(new Paragraph({
                children: [new TextRun({ text: element.textContent || '', bold: true })],
                heading: HeadingLevel.HEADING_3,
              }));
            } else if (element.tagName === 'P') {
              const children: TextRun[] = [];
              element.childNodes.forEach(pChild => {
                if (pChild.nodeType === Node.TEXT_NODE && pChild.textContent?.trim()) {
                  children.push(new TextRun(pChild.textContent.trim()));
                } else if (pChild.nodeType === Node.ELEMENT_NODE) {
                  const pElement = pChild as HTMLElement;
                  if (pElement.tagName === 'STRONG') {
                    children.push(new TextRun({ text: pElement.textContent || '', bold: true }));
                  } else if (pElement.tagName === 'EM') {
                    children.push(new TextRun({ text: pElement.textContent || '', italics: true }));
                  } else {
                    // Fallback for other inline elements, just add text content
                    if (pElement.textContent?.trim()) {
                      children.push(new TextRun(pElement.textContent.trim()));
                    }
                  }
                }
              });
              if (children.length > 0) {
                docChildren.push(new Paragraph({ children }));
              } else if (element.textContent?.trim()) { // Fallback for simple text in P
                 docChildren.push(new Paragraph({ children: [new TextRun(element.textContent.trim())] }));
              }
            } else if (element.tagName === 'UL') {
              element.querySelectorAll('li').forEach(li => {
                if (li.textContent?.trim()) {
                  docChildren.push(new Paragraph({ children: [new TextRun(li.textContent.trim())], bullet: { level: 0 } }));
                }
              });
            } else if (element.tagName === 'TABLE') {
                const tableRows: TableRow[] = [];
                element.querySelectorAll('tr').forEach(tr => {
                    const cells: TableCell[] = [];
                    tr.querySelectorAll('th, td').forEach(cell => {
                        cells.push(new TableCell({
                            children: [new Paragraph(cell.textContent || '')],
                            borders: {
                                top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                            },
                        }));
                    });
                    tableRows.push(new TableRow({ children: cells }));
                });
                docChildren.push(new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }));
                docChildren.push(new Paragraph({ text: "" })); // Add a blank line after table
            }
          }
        });
      } else {
        // Plain text for transcript
        content.split('\n').forEach(line => {
          if (line.trim()) {
            docChildren.push(new Paragraph({ children: [new TextRun(line.trim())] }));
          }
        });
      }

      const doc = new Document({
        sections: [{
          children: docChildren,
        }],
      });

      const docxBlob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error generating DOCX:', err);
      setError('An error occurred while generating the DOCX file.');
    }
  } else if (format === 'md') {
    try {
      const turndownService = new TurndownService();
      let markdownContent = '';
      if (isHtml) {
        markdownContent = turndownService.turndown(content);
      } else {
        markdownContent = content; // Plain text is already markdown-like
      }

      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating Markdown:', err);
      setError('An error occurred while generating the Markdown file.');
    }
  } else {
    // Default to TXT
    let textContent = content;
    if (isHtml) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      textContent = tempDiv.textContent || tempDiv.innerText || '';
    }
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};