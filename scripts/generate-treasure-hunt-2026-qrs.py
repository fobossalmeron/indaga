"""Generate and independently decode print-ready 2026 QR assets.
Install dependencies in a virtualenv: pip install 'qrcode[pil]' zxing-cpp
Run: python scripts/generate-treasure-hunt-2026-qrs.py
"""
import csv
import json
from pathlib import Path
import zipfile
import qrcode
import qrcode.image.svg
import zxingcpp
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
config = json.loads((ROOT / 'data/treasure-hunt-2026.json').read_text())
output = ROOT / 'outputs/treasure-hunt-2026'
for format in ['png', 'svg']:
    (output / format).mkdir(parents=True, exist_ok=True)
rows = []
for venue in config['venues']:
    code = venue['code']
    url = f"{config['public_origin']}/2026/t/{code}"
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=24, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    png = output / 'png' / f'{code}.png'
    svg = output / 'svg' / f'{code}.svg'
    qr.make_image(fill_color='black', back_color='white').save(png)
    qr.make_image(image_factory=qrcode.image.svg.SvgPathFillImage).save(svg)
    decoded = zxingcpp.read_barcode(Image.open(png))
    if decoded is None or decoded.text != url:
        raise RuntimeError(f'QR decode failed: {code}')
    rows.append({'name':venue['name'],'code':code,'url':url,'png':f'png/{code}.png','svg':f'svg/{code}.svg'})
assert len(rows) == 49 and len(set(r['url'] for r in rows)) == 49
(output / 'manifest.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
with (output / 'manifest.csv').open('w', newline='', encoding='utf-8-sig') as file:
    writer = csv.DictWriter(file, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
(output / 'LEEME.txt').write_text('''TREASURE HUNT 2026 — 49 códigos QR

Dominio: https://www.indaga.site
Formato de enlace: /2026/t/CODIGO

SVG: vector recomendado para imprenta; fondo blanco y margen incluidos.
PNG: copia de alta resolución; cada módulo mide 24 píxeles.
Mantener el margen blanco, proporción cuadrada y contraste negro/blanco.
No recortar ni superponer logos sobre el código.
Cada nombre de archivo identifica el lugar en manifest.csv / manifest.json.
Los 49 PNG se verifican con un lector QR independiente al generarse.

Los QR pueden imprimirse ahora. Para registrar visitas, primero publicar
la aplicación 2026 y activar la campaña en la base de datos.
Las visitas se habilitan desde el 30 de septiembre de 2026 a las 23:00
hasta terminar el 1 de diciembre de 2026, en horario de Monterrey.
''')
archive = output / 'treasure-hunt-2026-qrs.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for file in sorted(output.rglob('*')):
        if file.is_file() and file != archive:
            z.write(file, file.relative_to(output))
print(json.dumps({'venues':len(rows),'decoded':len(rows),'origin':config['public_origin'],'archive':str(archive)}))
