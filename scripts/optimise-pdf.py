"""Optimise and verify the existing designed CV, preserving its layout and tags."""
from pathlib import Path
import re
import sys
import pymupdf
from pypdf import PdfReader

target = Path(sys.argv[1]).resolve()
doc = pymupdf.open(target)
assert len(doc) == 1, 'The visual CV must be one A4 page'
fonts = doc[0].get_fonts()
assert all(f[2] != 'Type3' for f in fonts), 'Type 3 font found; use the static TrueType print faces'
assert all(f[1] == 'ttf' and len(doc.extract_font(f[0])[-1]) > 0 for f in fonts), 'Print fonts must be embedded TrueType'
doc.rewrite_images(dpi_threshold=300, dpi_target=220, quality=88)
metadata = dict(doc.metadata)
metadata.update(title='Maria-Eleni Konsta - Digital Marketing Leader - CV', author='Maria-Eleni Konsta', subject='Professional experience, digital marketing skills and education', keywords='Digital Marketing, Google Ads, SEO, E-commerce, Content Strategy, Analytics')
doc.set_metadata(metadata)
optimised = doc.tobytes(garbage=4, deflate=True)
doc.close()
assert len(optimised) < 2_500_000, 'PDF exceeds common parsing size limits'
target.write_bytes(optimised)

# Check real exported text rather than a hidden duplicate or a separate resume.
reader = PdfReader(target)
assert reader.trailer['/Root'].get('/StructTreeRoot'), 'PDF structure tags missing'
text = re.sub(r'\s+', ' ', reader.pages[0].extract_text())
assert 'konstamarialena@gmail.com' in text, 'Contact email missing'
sequence = ['WORK EXPERIENCE', 'Jun 2025', 'Head of Digital', 'GENEKOR Medical', 'Jan 2024', 'Marketing Manager', 'JUMBO', 'Jun 2024', 'Digital Performance Specialist', 'White Space Chelsea', 'Nov 2021', 'Marketing Assistant', 'Anubis', 'Sep 2023', 'E-Commerce Analyst', 'Grupo Sanut', 'Earlier experience', 'EDUCATION', 'MSc International Marketing', 'BSc Accounting', 'CERTIFICATIONS']
cursor = 0
for item in sequence:
    found = text.find(item, cursor)
    assert found >= 0, f'PDF reading order missing or misplaced: {item}'
    cursor = found + len(item)
for term in ['Google Ads', 'Meta advertising', 'Google Analytics', 'SEO', 'Generative AI', 'Prompt Engineering', 'Stakeholder communication', 'Cross-functional collaboration', 'Chinese']:
    assert term in text, f'Missing or broken keyword: {term}'
print(f'Optimised CV: {len(optimised):,} bytes; tagged text, job/date reading order and key skills verified')
