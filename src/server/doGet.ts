export default function doGet() {
  // Load index.html(embeded css,js)
  const output = HtmlService.createTemplateFromFile('index');
  return output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
