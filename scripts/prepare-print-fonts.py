"""Create static, uniquely named TrueType print faces from the licensed local fonts."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent
out = root / 'fonts' / 'print'
out.mkdir(exist_ok=True)
styles = {400:'Regular', 500:'Medium', 600:'SemiBold', 700:'Bold', 800:'ExtraBold'}
for family, weights in {'Manrope':[400,500,600,700,800], 'Geom':[700,800]}.items():
    for weight in weights:
        font = TTFont(root / 'fonts' / f'{family}-VF.woff2')
        instantiateVariableFont(font, {'wght':weight}, inplace=True)
        font.flavor = None
        names = {1:family+' Print', 2:styles[weight], 4:family+' Print '+styles[weight], 6:family+'Print-'+styles[weight], 16:family+' Print', 17:styles[weight]}
        for record in list(font['name'].names):
            if record.nameID in names:
                font['name'].setName(names[record.nameID],record.nameID,record.platformID,record.platEncID,record.langID)
        font['OS/2'].usWeightClass = weight
        font.save(out / f'{family}-{weight}.ttf')
print('Prepared 7 static TrueType print fonts with unique PostScript names')
