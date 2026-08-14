const fs = require('fs');
let txt = fs.readFileSync('src/components/canvasui/GlassObject.tsx', 'utf8');
const lastBrace = txt.lastIndexOf('}');
if (lastBrace !== -1) {
    const exportStatement = '\n\nexport default GlassObject;\n';
    txt = txt.substring(0, lastBrace + 1) + exportStatement;
}
fs.writeFileSync('src/components/canvasui/GlassObject.tsx', txt);
