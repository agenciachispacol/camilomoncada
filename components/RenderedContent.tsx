/**
 * Renderiza el HTML guardado desde el NeonEditor con el estilo neon de la página.
 * Asume que el HTML proviene del admin autenticado (no input untrusted).
 */
export default function RenderedContent({ html }: { html: string }) {
  return (
    <div
      className="neon-prose"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
