import json, re

with open(r'C:\Users\12031\.local\share\opencode\tool-output\tool_dcb54335b001Qo5McHeNWR4aiR', 'r', encoding='utf-8') as f:
    data = json.load(f)
html = data['parse']['text']['*']

cards_raw = re.split(r'(?=<div class="divsort")', html)
cards_raw = [c for c in cards_raw if 'data-param1=' in c]

# Show first 5 cards full param data
for i in range(5):
    c = cards_raw[i]
    no = re.search(r'NO\.(\d+)', c)
    name = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', c)
    p1 = re.search(r'data-param1="([^"]*)"', c)
    p2 = re.search(r'data-param2="([^"]*)"', c)
    p4 = re.search(r'data-param4="([^"]*)"', c)
    print(f'Card {i}: NO.{no.group(1) if no else "?"} {name.group(1) if name else "?"}')
    print(f'  param1={p1.group(1) if p1 else "?"}')
    print(f'  param2={p2.group(1) if p2 else "?"}')
    print(f'  param4={p4.group(1) if p4 else "?"}')
    print()

# Check cards with NO.001
no001 = [c for c in cards_raw if 'NO.001' in c]
print(f'Cards with NO.001: {len(no001)}')
for c in no001:
    name = re.search(r'block_2[^>]*>.*?<span[^>]*>([^<]+)', c)
    p1 = re.search(r'data-param1="([^"]*)"', c)
    p4 = re.search(r'data-param4="([^"]*)"', c)
    print(f'  name={name.group(1) if name else "?"}, param1={p1.group(1) if p1 else "?"}, param4={p4.group(1) if p4 else "?"}')

# Show first card raw (first 800 chars)
print("\n=== First card raw HTML (first 800 chars) ===")
print(cards_raw[0][:800])
