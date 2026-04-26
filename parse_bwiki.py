import json, re
from collections import Counter

with open(r'C:\Users\12031\.local\share\opencode\tool-output\tool_dcb7b0223001sVxFcArhyFHsjQ', 'r', encoding='utf-8') as f:
    lines = f.readlines()

results = []
current_dex = None
current_name = None

for line in lines:
    line = line.strip()
    m = re.match(r'^---\s+NO\.(\d+)\s+:\s+(.+?)\s+---$', line)
    if m:
        current_dex = m.group(1)
        raw_name = m.group(2)
        try:
            current_name = raw_name.encode('utf-8').decode('unicode_escape')
        except:
            current_name = raw_name
        continue
    
    if '180px' in line and '%E9%A1%B5%E9%9D%A2_%E5%AE%A0%E7%89%A9_%E7%AB%8B%E7%BB%98' in line:
        if current_dex and current_name:
            results.append({
                'dex': current_dex.zfill(3),
                'name': current_name,
                'url': line
            })

with open(r'E:\DEV\RocoDex\image-urls.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

dex_counts = Counter(r['dex'] for r in results)
multi = {d: c for d, c in dex_counts.items() if c > 1}
print(f'Total results: {len(results)}')
print(f'Unique dex: {len(dex_counts)}')
print(f'Dex range: {min(int(d) for d in dex_counts)} to {max(int(d) for d in dex_counts)}')
print(f'Multi-form dex count: {len(multi)}')
print(f'Multi-form dex: {sorted(multi.items(), key=lambda x: int(x[0]))}')

for r in results:
    if r['dex'] in ['011', '286', '347']:
        name_cp = ' '.join(hex(ord(c)) for c in r['name'])
        print(f'dex={r["dex"]} cps=[{name_cp}] url_last50={r["url"][-50:]}')
