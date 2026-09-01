# CSTD theme fonts

The files in this directory are WOFF2 subsets made for the personal homepage. The subset contains the characters currently used by the Chinese and English CSTD source/content plus a small punctuation and ASCII baseline. Keep the original license files in `licenses/` when replacing or regenerating a subset.

| Local family | Source | Version | Role | License |
| --- | --- | --- | --- | --- |
| CSTD Neon Display | [Smiley Sans](https://github.com/atelier-anchor/smiley-sans) | 2.0.1 | Neon display type | SIL OFL 1.1 |
| CSTD Neon Latin | [Oxanium](https://github.com/google/fonts/tree/main/ofl/oxanium) | current source snapshot | English neon display and interface type | SIL OFL 1.1 |
| CSTD Ink Text / Display | [LXGW WenKai Lite](https://github.com/lxgw/LxgwWenKai-Lite) | 1.522 | Ink body and display type | SIL OFL 1.1 |
| CSTD Ink Latin / Italic | [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond) | current source snapshot | English ink display, body, and calligraphic accent type | SIL OFL 1.1 |
| CSTD Press Serif | [Noto Serif SC](https://github.com/notofonts/noto-cjk) | current source snapshot | Chinese editorial serif | SIL OFL 1.1 |
| CSTD Press Latin | [Newsreader](https://github.com/productiontype/Newsreader) | current source snapshot | Latin editorial serif | SIL OFL 1.1 |
| CSTD Pixel Text / Label | [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font) | 2026.08.11 | Proportional and monospaced pixel type | SIL OFL 1.1 |
| CSTD Underworld Display | [Cinzel](https://github.com/google/fonts/tree/main/ofl/cinzel) | current source snapshot | Latin mythic display and inscription type | SIL OFL 1.1 |

The corresponding license text is stored beside these files. The homepage preloads only the persisted active theme and locale's font files; inactive faces remain lazy.

`neon-display-v1.woff2` is a modified web subset whose internal family and PostScript names are `CSTD Neon Display` / `CSTDNeonDisplay`. Preserve that rename when regenerating it: the Smiley Sans OFL declares `Smiley` and `得意黑` as Reserved Font Names.
