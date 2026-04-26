import json
import re

with open(r'C:\Users\12031\.local\share\opencode\tool-output\tool_dcb54335b001Qo5McHeNWR4aiR', 'r', encoding='utf-8') as f:
    data = json.load(f)

html = data['parse']['text']['*']

# Split into cards
cards_raw = re.split(r'(?=<div class="divsort")', html)
cards_raw = [c for c in cards_raw if 'data-param1=' in c]

print(f'Total cards: {len(cards_raw)}')

creatures = []
for card in cards_raw:
    # Extract NO number
    no_match = re.search(r'NO\.(\d+)', card)
    dex_num = no_match.group(1) if no_match else '?'
    
    # Extract name from block_2
    name_match = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', card)
    name = name_match.group(1).strip() if name_match else '?'
    
    # Extract form from block_3
    form_match = re.search(r'block_3[^>]*>.*?<span[^>]*>([^<]+)', card)
    form = form_match.group(1).strip() if form_match else ''
    
    # Extract data params
    p1_match = re.search(r'data-param1="([^"]*)"', card)
    param1 = p1_match.group(1) if p1_match else '?'
    
    p2_match = re.search(r'data-param2="([^"]*)"', card)
    param2 = p2_match.group(1) if p2_match else '?'
    
    p3_match = re.search(r'data-param3="([^"]*)"', card)
    param3 = p3_match.group(1) if p3_match else ''
    
    p4_match = re.search(r'data-param4="([^"]*)"', card)
    param4 = p4_match.group(1) if p4_match else '?'
    
    p5_match = re.search(r'data-param5="([^"]*)"', card)
    param5 = p5_match.group(1) if p5_match else '?'
    
    p6_match = re.search(r'data-param6="([^"]*)"', card)
    param6 = p6_match.group(1) if p6_match else '?'
    
    # Parse attributes
    if ', ' in param2:
        attr1 = param2.split(', ')[0]
        attr2 = param2.split(', ')[1]
    else:
        attr1 = param2
        attr2 = param3  # secondary attribute from param3 if present
    
    creatures.append({
        'no': dex_num,
        'name': name,
        'form': form,
        'stage': param1,
        'attr1': attr1,
        'attr2': attr2,
        'param4': param4,
        'param5': param5,
        'has_color': param6
    })

# Print all
for i, c in enumerate(creatures):
    attr2 = c['attr2'] if c['attr2'] else '-'
    form_str = f' [{c["form"]}]' if c['form'] else ''
    print(f'{i+1:3d}. NO.{c["no"]:3s} {c["name"]}{form_str} | stage={c["stage"]} | attr={c["attr1"]}/{attr2} | color={c["has_color"]}')

print(f'\nTotal: {len(creatures)} creatures')

# Count by stage
from collections import Counter
stage_count = Counter(c['stage'] for c in creatures)
print(f'\nStage breakdown:')
for stage, count in stage_count.most_common():
    print(f'  {stage}: {count}')
