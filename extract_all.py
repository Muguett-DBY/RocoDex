import json
import re

with open(r'C:\Users\12031\.local\share\opencode\tool-output\tool_dcb54335b001Qo5McHeNWR4aiR', 'r', encoding='utf-8') as f:
    data = json.load(f)

html = data['parse']['text']['*']

cards_raw = re.split(r'(?=<div class="divsort")', html)
cards_raw = [c for c in cards_raw if 'data-param1=' in c]

creatures = []
for card in cards_raw:
    no_match = re.search(r'NO\.(\d+)', card)
    dex_num = no_match.group(1) if no_match else '?'
    
    name_match = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', card)
    name = name_match.group(1).strip() if name_match else '?'
    
    form_match = re.search(r'block_3[^>]*>.*?<span[^>]*>([^<]+)', card)
    form = form_match.group(1).strip() if form_match else ''
    
    # href for wiki link  
    href_match = re.search(r'block_2[^>]*>.*?<a href="([^"]*)"', card)
    wiki_slug = href_match.group(1) if href_match else ''
    
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
    
    if ', ' in param2:
        attr1 = param2.split(', ')[0]
        attr2 = param2.split(', ')[1]
    else:
        attr1 = param2
        attr2 = param3
    
    creatures.append({
        'dex_num': dex_num,
        'name': name,
        'form_name': form,
        'stage': param1,
        'form_group': param4,
        'attr1': attr1,
        'attr2': attr2,
        'has_color': param6,
        'wiki_slug': wiki_slug
    })

# Write to JSON
with open(r'E:\DEV\RocoDex\creatures_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(creatures, f, ensure_ascii=False, indent=2)

# Print summary
from collections import Counter

print(f"Total cards extracted: {len(creatures)}")
print()

print("Stage (param1) breakdown:")
for k, v in Counter(c['stage'] for c in creatures).most_common():
    print(f"  {k}: {v}")

print()
print("Form group (param4) breakdown:")
for k, v in Counter(c['form_group'] for c in creatures).most_common():
    print(f"  {k}: {v}")

print()
print("Primary attribute breakdown:")
for k, v in Counter(c['attr1'] for c in creatures).most_common():
    print(f"  {k}: {v}")

print()
print("Has color breakdown:")
for k, v in Counter(c['has_color'] for c in creatures).most_common():
    print(f"  {k}: {v}")

# Unique dex numbers
unique_nos = set(c['dex_num'] for c in creatures)
print(f"\nUnique dex numbers: {len(unique_nos)} out of 465 entries")

# Print first 20 entries
print("\n=== First 20 entries ===")
for i, c in enumerate(creatures[:20]):
    a2 = c['attr2'] if c['attr2'] else '-'
    fm = f" [{c['form_name']}]" if c['form_name'] else ''
    print(f"{i+1:3d}. NO.{c['dex_num']:3s} {c['name']}{fm} | stage={c['stage']} | group={c['form_group']} | attr={c['attr1']}/{a2}")

# Print last 25 entries (boss forms)
print("\n=== Last 25 entries (boss forms) ===")
for i, c in enumerate(creatures[-25:]):
    a2 = c['attr2'] if c['attr2'] else '-'
    fm = f" [{c['form_name']}]" if c['form_name'] else ''
    print(f"{len(creatures)-25+i+1:3d}. NO.{c['dex_num']:3s} {c['name']}{fm} | stage={c['stage']} | group={c['form_group']} | attr={c['attr1']}/{a2}")
