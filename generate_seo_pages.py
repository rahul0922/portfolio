import os
import re

html_path = 'public/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

header_part = "".join(lines[:273])
footer_part = "".join(lines[2545:]) 

def create_page(filename, title, description, content_html):
    head = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', header_part)
    head = re.sub(r'<meta name="title" content=".*?">', f'<meta name="title" content="{title}">', head)
    head = re.sub(r'<meta name="description"\s+content=".*?">', f'<meta name="description" content="{description}">', head, flags=re.DOTALL)
    
    main_section = f"""
    <main class="main-layer js-pageContent">
        <div class="layer layer__dark" style="padding-top: 150px; padding-bottom: 150px; min-height: 80vh;">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8 col-sm-10 col-12 text-white">
                        {content_html}
                    </div>
                </div>
            </div>
        </div>
{footer_part}"""
    with open(f"public/{filename}", "w", encoding='utf-8') as f:
        f.write(head + main_section)

content_3d_product = """
<h1 class="mb-5 js-anim--chars">3D Product Animation Services</h1>
<h2 class="h3 mb-3" style="color: #4ade80;">Elevate Your Brand with High-End 3D Animation</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">In today's visually driven market, flat images and basic video simply aren't enough to capture attention or drive conversions. <strong>High-end 3D product animation</strong> allows you to showcase every angle, feature, and intricate detail of your product in stunning clarity. Whether you're launching a new consumer tech gadget, a premium lifestyle product, or high-end apparel, our 3D animation services deliver cinematic visuals that make a lasting impact on your audience.</p>

<h2 class="h3 mb-3 mt-5" style="color: #4ade80;">The Benefits of 3D Product Ads</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Using 3D visuals over traditional photography provides unparalleled flexibility. We can demonstrate impossible camera movements, slice through products to show internal mechanisms, and simulate complex lighting environments. Moreover, 3D assets are reusable and scalable for future marketing campaigns, rendering iterations much faster than organizing a costly physical photo shoot.</p>

<h2 class="h3 mb-3 mt-5" style="color: #4ade80;">How We Create High-Conversion Visuals</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Our workflow starts with understanding your brand's core messaging. We take your basic CAD models or 2D references and transform them into photorealistic marketing assets. We meticulously design materials, textures, and lighting setups tailored precisely to your brand guidelines. We then apply specialized motion graphics and compelling visual effects (VFX) to highlight your product's unique selling points (USPs), drastically increasing your Return on Ad Spend (ROAS).</p>
"""

content_3d_logo = """
<h1 class="mb-5 js-anim--chars">3D Logo Animation Services</h1>
<h2 class="h3 mb-3" style="color: #4ade80;">Bring Your Brand Identity to Life</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Your logo is the cornerstone of your brand identity, but in the digital world, static logos often fail to engage viewers on video platforms, presentations, and social media. A custom <strong>3D logo animation</strong> breathes life into your brand, transforming a flat design into a dynamic, memorable introduction. From subtle fluid motions to explosive, cinematic reveals, we craft animated logos that instantly convey your company's personality.</p>

<h2 class="h3 mb-3 mt-5" style="color: #4ade80;">Why Invest in a 3D Animated Logo?</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">First impressions are critical. Adding an expertly crafted 3D intro or outro to your promotional videos, pitch decks, and website creates a powerful brand recall. A professional animated logo signifies high value and establishes trust with your potential customers. Compared to generic 2D stings, customized 3D motion design offers an elevated aesthetic, perfectly suited for tech startups, gaming companies, and premium brands looking to stand out.</p>

<h2 class="h3 mb-3 mt-5" style="color: #4ade80;">Our Expert Motion Graphics Approach</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">We specialize in advanced motion graphics and particle simulations to generate eye-catching 3D logo reveals. By working closely with your branding guidelines, we ensure the motion and color grading perfectly match your established aesthetics. We deliver final animations optimized for multiple formats—including transparent overlays (alpha channels), 4K video, and lightweight files for web integration.</p>
"""

content_3d_advertising = """
<h1 class="mb-5 js-anim--chars">3D Advertising &amp; Commercials</h1>
<h2 class="h3 mb-3" style="color: #4ade80;">Cinematic Ads That Drive Sales</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">In an era of endless scrolling and shortened attention spans, your advertisements need to instantly disrupt your audience's feed. Our <strong>3D advertising and commercial studio</strong> specializes in producing hyper-engaging video ads for global startups and established brands. By combining striking 3D animation with dynamic video editing, we craft marketing campaigns designed specifically to capture attention and maximize conversions.</p>

<h2 class="h3 mb-3 mt-5" style="color: #4ade80;">The Power of Visual Storytelling</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Great advertising goes beyond just showcasing a product; it tells a compelling story. We integrate state-of-the-art visual effects (VFX), professional color grading, and captivating motion graphics to highlight the value proposition of your product. Our end-to-end commercial production ensures that every frame serves the purpose of building audience engagement and communicating your messaging flawlessly.</p>

<h2 class="h3 mb-3 mt-5" style="color: #4ade80;">Tailored for Digital Platforms</h2>
<p class="desc mb-4" style="font-size: 1.1rem; line-height: 1.8; opacity: 0.8;">Whether you are creating a high-budget brand anthem or quick, punchy social media ad creatives, we know what works on different platforms. We optimize our 3D video ads for various aspect ratios, ensuring your commercial looks spectacular on massive displays as well as vertical mobile screens. Partner with us to scale your business with premium, high-ROI 3D advertisements.</p>
"""

create_page("3d-product-animation.html", "3D Product Animation Services | Rahul", "Expert 3D product animation services to create stunning, high-converting cinematic visuals and ads for global startups.", content_3d_product)
create_page("3d-logo-animation.html", "3D Logo Animation Services | Rahul", "Transform your static brand identity into a dynamic, memorable 3D animated logo and intro tailored for video and web.", content_3d_logo)
create_page("3d-advertising.html", "3D Advertising & Commercials | Rahul", "Cinematic 3D advertising and commercial video production designed to engage audiences and generate high ROI for modern brands.", content_3d_advertising)

print("Created 3 SEO HTML pages in public directory.")
