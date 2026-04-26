import json

with open(r'E:\DEV\RocoDex\creatures_extracted.json', 'r', encoding='utf-8') as f:
    creatures = json.load(f)

for i, c in enumerate(creatures[:120]):
    a2 = c['attr2'] if c['attr2'] else '-'
    fm = ' [' + c['form_name'] + ']' if c['form_name'] else ''
    print(f"{i+1:3d}. NO.{c['dex_num']:3s} {c['name']:15s}{fm:25s} stage={c['stage']:8s} group={c['form_group']:8s} attr={c['attr1']:6s}/{a2:6s} color={c['has_color']}")
