export default function doGet(e: any) {
  const pathInfo = e.pathInfo;
  switch (pathInfo) {
    case "":
      return outputIndexHTML();
    case "settings":
      return getSettings();
    default:
      console.log("default");
      return outputIndexHTML();
  }
}

function outputIndexHTML() {
  // Load index.html(embeded css,js)
  const output = HtmlService.createTemplateFromFile("index");
  return output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getSettings() {
  const data = [{}, {}];
  const payload = JSON.stringify(data);
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(payload);
  return output;
}
