import json
import re

with open(r'C:\Users\12031\.local\share\opencode\tool-output\tool_dcb54335b001Qo5McHeNWR4aiR', 'r', encoding='utf-8') as f:
    data = json.load(f)

html = data['parse']['text']['*']

# Split into cards
cards_raw = re.split(r'(?=<div class="divsort")', html)
cards_raw = [c for c in cards_raw if 'data-param1=' in c]

print(f'Total cards: {len(cards_raw)}\n')

# Check param4/param5 distribution for last 24 cards (boss/regional forms)
print("=== Last 30 cards (checking param4/param5) ===")
for card in cards_raw[-30:]:
    no_match = re.search(r'NO\.(\d+)', card)
    dex_num = no_match.group(1) if no_match else '?'
    name_match = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', card)
    name = name_match.group(1).strip() if name_match else '?'
    form_match = re.search(r'block_3[^>]*>.*?<span[^>]*>([^<]+)', card)
    form = form_match.group(1).strip() if form_match else ''
    p1 = re.search(r'data-param1="([^"]*)"', card).group(1) if re.search(r'data-param1="([^"]*)"', card) else '?'
    p4 = re.search(r'data-param4="([^"]*)"', card).group(1) if re.search(r'data-param4="([^"]*)"', card) else '?'
    p5 = re.search(r'data-param5="([^"]*)"', card).group(1) if re.search(r'data-param5="([^"]*)"', card) else '?'
    form_str = f' [{form}]' if form else ''
    print(f'NO.{dex_num} {name}{form_str} | p1={p1} | p4={p4} | p5={p5}')

# Now let me check cards with p4=地区形态 or p4=首领形态
print("\n=== Cards with param4=地区形态 ===")
for card in cards_raw:
    p4 = re.search(r'data-param4="([^"]*)"', card).group(1) if re.search(r'data-param4="([^"]*)"', card) else '?'
    if p4 == '地区形态':
        no_match = re.search(r'NO\.(\d+)', card)
        dex_num = no_match.group(1) if no_match else '?'
        name_match = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', card)
        name = name_match.group(1).strip() if name_match else '?'
        form_match = re.search(r'block_3[^>]*>.*?<span[^>]*>([^<]+)', card)
        form = form_match.group(1).strip() if form_match else ''
        form_str = f' [{form}]' if form else ''
        print(f'NO.{dex_num} {name}{form_str}')

print("\n=== Cards with param4=首领形态 ===")
for card in cards_raw:
    p4 = re.search(r'data-param4="([^"]*)"', card).group(1) if re.search(r'data-param4="([^"]*)"', card) else '?'
    if p4 == '首领形态':
        no_match = re.search(r'NO\.(\d+)', card)
        dex_num = no_match.group(1) if no_match else '?'
        name_match = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', card)
        name = name_match.group(1).strip() if name_match else '?'
        form_str = f' [{form}]' if form else ''
        print(f'NO.{dex_num} {name}{form_str}')
