with open('public/index.html', 'r') as f:
    lines = f.readlines()

def find_line(substr, start=0):
    for i in range(start, len(lines)):
        if substr in lines[i]:
            return i
    return -1

base_work = find_line('<div id="work">')
base_video = find_line('<div class="video" id="video">')
base_testi = find_line('<div class="testimonials js-testimonials">')

red_work = find_line('<div class="work work__red">')
red_video = find_line('<div class="video video__red">')
red_testi = find_line('<!-- SPACER TO ALIGN FROM TESTIMONIALS DOWN -->')

print(f'Base work: {base_work}')
print(f'Base video: {base_video}')
print(f'Base testi: {base_testi}')
print(f'Red work: {red_work}')
print(f'Red video: {red_video}')
print(f'Red testi: {red_testi}')
