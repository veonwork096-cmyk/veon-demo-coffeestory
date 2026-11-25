import sys
from fontTools.ttLib import TTFont
from fontTools import subset
src, outdir = sys.argv[1], sys.argv[2]
f = TTFont(src)
names = set(f.getGlyphOrder())
n = 0
for t in f['cmap'].tables:
    if not t.isUnicode(): continue
    for cp, g in list(t.cmap.items()):
        alt = g + '.loclRUS'
        if alt in names:
            t.cmap[cp] = alt; n += 1
print('remapped', n)
f.save(outdir + '/SofiaSans-std.ttf')
ranges = {
 'cyrillic': 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
 'latin': 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
}
for k, r in ranges.items():
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern','liga','calt','ccmp','mark','mkmk','tnum','lnum','pnum','case']
    ft = TTFont(outdir + '/SofiaSans-std.ttf')
    s = subset.Subsetter(opts); s.populate(unicodes=subset.parse_unicodes(r)); s.subset(ft)
    ft.flavor = 'woff2'; ft.save(f'{outdir}/sofia-sans-{k}-wght-normal.woff2'); print(k)
