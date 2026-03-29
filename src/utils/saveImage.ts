import html2canvas from 'html2canvas';

/** Capture a DOM element and download it as PNG. */
export async function captureAndDownload(el: HTMLElement, filename: string): Promise<void> {
  // Wait for fonts to be ready so custom fonts render correctly
  await document.fonts.ready;

  const canvas = await html2canvas(el, {
    backgroundColor: '#0a0a0f',
    scale: 2,         // Retina-quality output
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 0,
  });

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Sanitize a string for use as a filename. */
export function toSafeFilename(s: string): string {
  return s.replace(/[\\/:*?"<>|\s]/g, '_').slice(0, 40);
}

/** Format today as MMDD string. */
export function dateTag(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
