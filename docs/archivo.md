# Archivo

El listado vive en `/archivo` y cada publicación en `/archivo/[uid]`. Las URLs de `/blog` redirigen permanentemente conservando el UID. Navegación y sitemap apuntan a Archivo.

Se reutiliza el custom type `post` de Prismic, ahora etiquetado **Archivo**. Se conservan todos los campos anteriores y los artículos publicados. No hay que crear otro tipo ni migrar los documentos.

## Campos editoriales

| Campo                                     | Uso                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `article_type`                            | Selector: Conversación o Ensayo. Controla la categoría y el encabezado “En conversación con” / “Ensayo sobre”. |
| `introduction`                            | Texto enriquecido opcional, antes del video y del cuerpo.                                                      |
| `video`                                   | Embed opcional: pegar una URL de YouTube o Vimeo.                                                              |
| `hero`, `title`, `date`, `author`, `body` | Campos existentes de portada, título, fecha, autor opcional y cuerpo.                                          |
| `seo_title`, `meta_description`           | Metadatos existentes. Si falta el título SEO se usa el título del artículo.                                    |

Los artículos anteriores sin `article_type` se muestran como Ensayo. Al editarlos se puede elegir su tipo; no se asignan conversaciones automáticamente. Introducción y video solo aparecen si tienen contenido.

## Sincronizar el modelo

1. Ejecutar `yarn slicemachine` y abrir `http://localhost:9999`.
2. Iniciar sesión con acceso al repositorio `indaga`.
3. Revisar en **Changes** únicamente el modelo `post` (Archivo): se agregan los tres campos de arriba y cambia su etiqueta; no se eliminan campos existentes.
4. Sincronizar ese modelo con Prismic. Esta operación no hace `git push` ni publica artículos.
5. En Prismic, abrir una publicación de Archivo, elegir su tipo y completar los campos opcionales según corresponda. Los cambios de contenido aparecen en el sitio después de publicar y revalidar.

El filtro del listado usa `?categoria=Conversación` o `?categoria=Ensayo`; una categoría desconocida muestra todo. Las fechas se formatean sin depender de la zona horaria del servidor o del navegador.
