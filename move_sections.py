with open('public/index.html', 'r') as f:
    lines = f.readlines()

def find_line(substr):
    for i in range(len(lines)):
        if substr in lines[i]:
            return i
    return -1

base_video_start = find_line('<div class="video" id="video">')
base_testi_start = find_line('<div class="testimonials js-testimonials">')
red_video_start = find_line('<div class="video video__red">')
red_testi_start = find_line('<!-- SPACER TO ALIGN FROM TESTIMONIALS DOWN -->')

red_vid = lines[red_video_start:red_testi_start]
del lines[red_video_start:red_testi_start]

base_vid = lines[base_video_start:base_testi_start]
del lines[base_video_start:base_testi_start]

red_work_start = find_line('<div class="work work__red">')
lines = lines[:red_work_start] + red_vid + lines[red_work_start:]

base_work_start = find_line('<div id="work">')
lines = lines[:base_work_start] + base_vid + lines[base_work_start:]

with open('public/index.html', 'w') as f:
    f.writelines(lines)

print("Moved successfully")
