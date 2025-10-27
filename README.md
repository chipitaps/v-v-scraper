## Viviendas y Valores Scraper

Este scraper automatizado extrae información de propiedades publicadas en el sitio web viviendasyvalores.com.co, permite buscar inmuebles en venta o arriendo, filtrando por tipo de propiedad, número de habitaciones, ubicación y rango de precios.

El actor recorre automáticamente las páginas con resultados y guarda los datos de cada propiedad (imagen, nombre, área, precio y enlace) en un dataset dentro de Apify.
Así puedes analizar la información, exportarla a Excel o integrarla en tus propios sistemas sin hacerlo manualmente.


## Funcionalidades incluidas

- Apify SDK – Para manejar la ejecución y guardar los resultados automáticamente.
- PlaywrightCrawler (Crawlee) – Permite navegar el sitio web igual que un usuario real.
- Cheerio – Extrae de forma rápida y precisa los datos de cada anuncio.
- Filtros dinámicos – El actor construye automáticamente el enlace de búsqueda según tus preferencias

## Como funciona

1. El actor recibe tu configuración mediante un input JSON (por ejemplo, tipo de propiedad o precios).
2. Según la operación seleccionada (Venta o Arriendo), crea una URL personalizada en el sitio de Viviendas y Valores.
3. Recorre automáticamente todas las páginas necesarias para alcanzar la cantidad de resultados que pediste.
4. De cada anuncio, extrae los datos principales: imagen, nombre, área, precio y enlace directo.
5. Guarda toda la información en un dataset de Apify, lista para descargar o analizar.

## Informacion del Output

- Imagen de Referencia
- Nombre
- Area
- Precio
- Enlace

## Como Usarlo

Puedes ejecutar el actor directamente desde Apify o en tu computadora local con:

```bash
apify run
```
Ingresa un input como este

```json
{
  "inmtype": "Apartamentos",
  "items": 20,
  "maxprice": 1000000,
  "minprice": 700000,
  "oper": "Arriendo",
  "rooms": 1
}
```
El resultado esperado:

```powershell
[
  {
    "img": "https://cdnvyv.s3.us-east-2.amazonaws.com/wp-uploads/imagenes2020/29023N1zixlhbbyxBoy.jpg",
    "name": "Apartamento en Arriendo - Cabrera",
    "area": "50m²",
    "price": 1200000,
    "link": "https://viviendasyvalores.com.co/detalle-propiedad/?proid=29023&idpost=232907"
  },
  {
    "img": "https://cdnvyv.s3.us-east-2.amazonaws.com/wp-uploads/imagenes2020/25849N1iYMG6QR26cEA.jpg",
    "name": "Apartamento en Arriendo - Prados Norte",
    "area": "64m²",
    "price": 1200000,
    "link": "https://viviendasyvalores.com.co/detalle-propiedad/?proid=25849&idpost=49362"
  }
]
```

## Consejos y Notas
- El actor se detiene automáticamente cuando alcanza la cantidad de resultados solicitados o si no hay más propiedades disponibles.
- Los filtros de precio mínimo y máximo se ajustan de forma automática si están fuera del rango permitido por el sitio web.
- Los resultados se pueden descargar desde el Dataset en formato CSV, JSON, Excel o XML.
