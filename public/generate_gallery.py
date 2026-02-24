import math

def generate_svg(content):
    return f'<div class="logo-card"><div class="svg-container"><svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter">{content}</svg></div></div>'

html_out = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abstract Studio Logos - 30 Variations</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
        
        body { background-color: #f7f7f7; color: #111; font-family: 'Inter', sans-serif; margin: 0; padding: 60px 40px; display: flex; flex-direction: column; align-items: center; }
        h1 { font-weight: 300; margin-bottom: 10px; font-size: 32px; text-align: center; }
        p.subtitle { color: #666; margin-bottom: 60px; text-align: center; max-width: 600px; line-height: 1.6; }
        h2 { font-weight: 400; margin-top: 60px; margin-bottom: 30px; font-size: 24px; width: 100%; max-width: 1200px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 30px; max-width: 1200px; width: 100%; }
        @media (max-width: 1000px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        .logo-card { background: #fff; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border-radius: 8px; padding: 50px 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; position: relative; cursor: pointer; }
        .logo-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #111; }
        .svg-container { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; }
        svg { width: 100%; height: 100%; overflow: visible; }
    </style>
</head>
<body>
    <h1>30 Handmade Studio Vectors</h1>
    <p class="subtitle">I expanded all 6 original concepts into 5 distinct architectural variations each. Hover over them to see the sharp vector quality!</p>
"""

# 1. Focus Bracket / Viewfinders
html_out += "<h2>1. Focus Bracket (Viewfinders & Framing)</h2><div class='grid'>"
# V1: basic
html_out += generate_svg('<path d="M 25 40 L 25 25 L 40 25" /><path d="M 75 60 L 75 75 L 60 75" /><rect x="42" y="42" width="16" height="16" fill="#111" stroke="none" />')
# V2: corner dots
html_out += generate_svg('<path d="M 20 20 L 40 20 M 20 20 L 20 40 M 80 80 L 60 80 M 80 80 L 80 60" /><circle cx="50" cy="50" r="6" fill="#111" stroke="none" />')
# V3: inner cross
html_out += generate_svg('<rect x="15" y="15" width="70" height="70" /><path d="M 50 40 L 50 60 M 40 50 L 60 50" stroke-width="3" />')
# V4: full box w gap
html_out += generate_svg('<path d="M 10 30 L 10 10 L 90 10 L 90 30 M 10 70 L 10 90 L 90 90 L 90 70" /><rect x="45" y="45" width="10" height="10" />')
# V5: angled corners
html_out += generate_svg('<polygon points="50,15 85,50 50,85 15,50" /><circle cx="50" cy="50" r="10" fill="#111" stroke="none"/>')
html_out += "</div>"

# 2. Open Shutter / Blades
html_out += "<h2>2. Open Shutter (Aperture & Motion)</h2><div class='grid'>"
html_out += generate_svg('<path d="M 50 15 L 20 70" /><path d="M 25 80 L 85 80" /><path d="M 80 70 L 50 15" />')
html_out += generate_svg('<circle cx="50" cy="50" r="40" stroke-width="2" /><polygon points="50,30 65,60 35,60" fill="#111" stroke="none" /><path d="M 50 30 L 50 10 M 65 60 L 85 70 M 35 60 L 15 70" stroke-width="2"/>')
html_out += generate_svg('<path d="M 50 20 L 65 80 M 35 20 L 50 80 M 20 50 L 80 35 M 20 35 L 80 50" stroke-width="3"/>')
html_out += generate_svg('<path d="M 30 20 A 40 40 0 0 1 70 80" /><path d="M 70 20 A 40 40 0 0 0 30 80" /><circle cx="50" cy="50" r="8" fill="#111" stroke="none"/>')
html_out += generate_svg('<polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke-width="3"/><path d="M 10 30 L 50 50 M 90 30 L 50 50 M 50 90 L 50 50" stroke-width="3"/>')
html_out += "</div>"

# 3. Isometric Core / Cubes
html_out += "<h2>3. Isometric Core (3D & Form)</h2><div class='grid'>"
html_out += generate_svg('<polygon points="50,20 80,35 50,50 20,35" fill="#111" /><polygon points="20,35 50,50 50,85 20,70" stroke-width="3" /><polygon points="50,50 80,35 80,70 50,85" stroke-width="3" />')
html_out += generate_svg('<polygon points="50,25 75,40 50,55 25,40" /><polygon points="25,40 50,55 50,80 25,65" /><polygon points="50,55 75,40 75,65 50,80" /><line x1="50" y1="55" x2="50" y2="25" /><line x1="50" y1="55" x2="25" y2="65" /><line x1="50" y1="55" x2="75" y2="65" />')
html_out += generate_svg('<rect x="30" y="30" width="40" height="40" stroke-width="3"/><rect x="40" y="40" width="40" height="40" stroke-width="3"/><line x1="30" y1="30" x2="40" y2="40" stroke-width="3"/><line x1="70" y1="30" x2="80" y2="40" stroke-width="3"/><line x1="30" y1="70" x2="40" y2="80" stroke-width="3"/><line x1="70" y1="70" x2="80" y2="80" stroke-width="3"/>')
html_out += generate_svg('<path d="M 20 50 L 50 30 L 80 50 L 50 70 Z" stroke-width="4"/><path d="M 35 50 L 50 40 L 65 50 L 50 60 Z" fill="#111" stroke="none"/>')
html_out += generate_svg('<polygon points="30,80 30,20 80,20" /><polygon points="30,80 80,20 80,80" fill="#111" stroke="none"/>')
html_out += "</div>"

# 4. Dimensional Target / Perspective
html_out += "<h2>4. Dimensional Target (Vectors & Rays)</h2><div class='grid'>"
html_out += generate_svg('<rect x="25" y="25" width="50" height="50" stroke-width="4"/><path d="M 15 15 L 35 35" /><path d="M 85 85 L 65 65" /><path d="M 85 15 L 65 35" /><path d="M 15 85 L 35 65" /><circle cx="50" cy="50" r="10" fill="#111" stroke="none"/>')
html_out += generate_svg('<rect x="20" y="20" width="60" height="60" stroke-width="2"/><rect x="35" y="35" width="30" height="30" stroke-width="2"/><rect x="45" y="45" width="10" height="10" fill="#111" stroke="none"/>')
html_out += generate_svg('<circle cx="50" cy="50" r="40" stroke-width="2"/><circle cx="50" cy="50" r="25" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#111" stroke="none"/><line x1="50" y1="10" x2="50" y2="25" /><line x1="50" y1="75" x2="50" y2="90" /><line x1="10" y1="50" x2="25" y2="50" /><line x1="75" y1="50" x2="90" y2="50" />')
html_out += generate_svg('<path d="M 15 50 C 15 15 85 15 85 50 C 85 85 15 85 15 50" /><path d="M 30 50 C 30 30 70 30 70 50 C 70 70 30 70 30 50" />')
html_out += generate_svg('<circle cx="50" cy="50" r="40" stroke-width="2"/><line x1="50" y1="10" x2="50" y2="90" stroke-width="2"/><line x1="10" y1="50" x2="90" y2="50" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#111" stroke="none"/>')
html_out += "</div>"

# 5. Render Ring / Data Streams
html_out += "<h2>5. Render Ring (Process & Time)</h2><div class='grid'>"
html_out += generate_svg('<circle cx="50" cy="50" r="35" stroke-dasharray="25 15" /><circle cx="50" cy="50" r="18" fill="#111" stroke="none" />')
html_out += generate_svg('<circle cx="50" cy="50" r="40" stroke-width="2"/><circle cx="50" cy="50" r="30" stroke-dasharray="4 8" stroke-width="4"/><circle cx="50" cy="50" r="15" fill="#111" stroke="none"/>')
html_out += generate_svg('<circle cx="50" cy="50" r="35" stroke-dasharray="60 50" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="50" r="22" stroke-dasharray="30 40" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="8" fill="#111" stroke="none"/>')
html_out += generate_svg('<path d="M 50 10 A 40 40 0 0 1 90 50" stroke-width="8"/><path d="M 90 50 A 40 40 0 0 1 50 90" stroke-width="4"/><path d="M 50 90 A 40 40 0 0 1 10 50" stroke-width="2"/><path d="M 10 50 A 40 40 0 0 1 50 10" stroke-width="4"/>')
html_out += generate_svg('<circle cx="40" cy="40" r="25" stroke-dasharray="10 10"/><circle cx="60" cy="60" r="25" stroke-dasharray="10 10"/><circle cx="50" cy="50" r="8" fill="#111" stroke="none"/>')
html_out += "</div>"

# 6. Intersection / Negative Space
html_out += "<h2>6. Intersection (Boolean Logic)</h2><div class='grid'>"
html_out += generate_svg('<circle cx="40" cy="50" r="25" /><circle cx="60" cy="50" r="25" /><path d="M 50 28 L 50 72" stroke-dasharray="4 6" />')
html_out += generate_svg('<rect x="25" y="25" width="40" height="40" /><rect x="35" y="35" width="40" height="40" fill="#111" stroke="none"/><rect x="25" y="25" width="40" height="40" stroke-width="2"/>')
html_out += generate_svg('<circle cx="50" cy="35" r="25" /><circle cx="35" cy="60" r="25" /><circle cx="65" cy="60" r="25" /><circle cx="50" cy="50" r="8" fill="#111" stroke="none"/>')
html_out += generate_svg('<polygon points="50,15 80,80 20,80" /><polygon points="50,85 80,20 20,20" />')
html_out += generate_svg('<path d="M 10 50 A 40 40 0 0 1 90 50" fill="#111" stroke="none"/><path d="M 20 60 A 30 30 0 0 0 80 60" fill="#111" stroke="none"/>')
html_out += "</div>"

html_out += "</body></html>"

with open('logo_gallery.html', 'w') as f:
    f.write(html_out)
print("done")
