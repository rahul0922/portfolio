const fs = require('fs');
const path = require('path');

const filePath = path.join('/Users/grogu/Downloads/minhpham.design/public', 'about.html');
let html = fs.readFileSync(filePath, 'utf8');

const regex = /\/\* ── HP HEADER[\s\S]*?(?=\/\* ── HERO ──)/;
if (regex.test(html)) {
    html = html.replace(regex, '');
    fs.writeFileSync(filePath, html);
    console.log("Removed inline hp-header CSS from about.html");
} else {
    console.log("Could not find inline hp-header CSS in about.html");
}

const regex2 = /\/\* ── HP HEADER[\s\S]*?(?=\/\* ── HERO ──)/;
const saasPath = path.join('/Users/grogu/Downloads/minhpham.design/public', 'saas-animation.html');
let saasHtml = fs.readFileSync(saasPath, 'utf8');
if (regex2.test(saasHtml)) {
    saasHtml = saasHtml.replace(regex2, '');
    fs.writeFileSync(saasPath, saasHtml);
    console.log("Removed inline hp-header CSS from saas-animation.html");
} else {
    console.log("Could not find inline hp-header CSS in saas-animation.html");
}

