/**
 * Stands in for jsPDF's optional peers.
 *
 * jsPDF lazily imports html2canvas and dompurify for `.html()`, which renders a
 * DOM tree by screenshotting it, and canvg for `.addSvgAsImage()`. We call
 * neither — the PDF is drawn as text — so aliasing them here keeps ~380 KB of
 * unused code out of the deploy. If either is ever needed, drop the matching
 * alias in vite.config.js.
 */
export default {}
