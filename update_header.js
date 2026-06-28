const fs = require('fs');
const path = require('path');

const cssPath = path.join('/Users/grogu/Downloads/minhpham.design/public', 'app.css');
let css = fs.readFileSync(cssPath, 'utf8');

const regex = /\.header\s*\{[\s\S]*?(?=\.frame-mobile\s*\{)/;
const match = css.match(regex);
if (match) {
    console.log("Found header CSS block to replace.");
    const replacement = `.header {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    max-width: 95%;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background: rgba(20, 20, 20, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.header:hover {
    background: rgba(30, 30, 30, 0.85);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
}

.header_logo {
    display: flex;
    align-items: center;
    margin-right: 20px;
}

@media (min-width: 992px) {
    .header_logo {
        margin-right: 40px;
    }
}

.header_logo img {
    height: 32px;
    width: auto;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.header_logo:hover img {
    transform: scale(1.08) rotate(-2deg);
}

.header_menu {
    display: block;
}

.header_menu_list {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

@media (min-width: 768px) {
    .header_menu_list {
        gap: 15px;
    }
}

.header_menu_item {
    position: relative;
}

.header_menu_item a {
    text-decoration: none;
    display: block;
    padding: 8px 16px;
    border-radius: 30px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.header_menu_item_inner {
    display: block;
    position: relative;
    overflow: hidden;
}

.header_menu_item_link {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), color 0.3s ease;
    white-space: nowrap;
}

/* Base text color */
.header_menu_item_link__deep {
    color: rgba(255, 255, 255, 0.6);
}

/* Hover state color */
.header_menu_item_link__active {
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: translateY(100%);
}

.header_menu_item:hover .header_menu_item_link__deep {
    transform: translateY(-100%);
}

.header_menu_item:hover .header_menu_item_link__active {
    transform: translateY(0);
}

/* Background hover effect */
.header_menu_item a:hover {
    background: rgba(255, 255, 255, 0.08);
}

/* Active page highlighting */
.header_menu_item.is-active a, .header_menu_item.current-page a {
    background: linear-gradient(135deg, #ff4757, #ff6b6b);
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
}

.header_menu_item.is-active .header_menu_item_link__deep, .header_menu_item.current-page .header_menu_item_link__deep {
    color: #fff;
}

.header_menu_item.is-active:hover .header_menu_item_link__deep, .header_menu_item.current-page:hover .header_menu_item_link__deep {
    transform: translateY(0);
}

.header_menu_item.is-active:hover .header_menu_item_link__active, .header_menu_item.current-page:hover .header_menu_item_link__active {
    transform: translateY(100%);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .header {
        top: 15px;
        width: 90%;
        padding: 8px 12px;
        justify-content: center;
    }
    .header_logo {
        display: none; /* Hide logo on small screens to fit links */
    }
    .header_menu_list {
        gap: 5px;
    }
    .header_menu_item a {
        padding: 6px 12px;
    }
    .header_menu_item_link {
        font-size: 0.7rem;
    }
}
\n`;
    css = css.replace(regex, replacement);
    fs.writeFileSync(cssPath, css);
    console.log("Replaced header CSS successfully.");
} else {
    console.log("Could not find regex match.");
}
