const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');
const errScript = `
<script>
window.onerror = function(msg, url, lineNo, columnNo, error) {
  require('fs').appendFileSync('frontend_error.log', msg + ' at ' + lineNo + ':' + columnNo + '\\n');
  return false;
};
window.addEventListener('unhandledrejection', function(event) {
  require('fs').appendFileSync('frontend_error.log', 'Unhandled promise rejection: ' + event.reason + '\\n');
});
</script>
`;
content = content.replace('<head>', '<head>\n' + errScript);
fs.writeFileSync('public/index.html', content);
