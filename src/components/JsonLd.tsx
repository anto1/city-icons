/**
 * Renders one <script type="application/ld+json"> per object. Top-level objects
 * get the schema.org @context added here, so builders only describe the entity.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...item }),
      }}
    />
  ));
}
