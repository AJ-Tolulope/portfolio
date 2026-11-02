export function SectionTitle({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className="section-title">
      <h2 data-heading={eyebrow} data-aos="fade-up">
        {title}
      </h2>
    </div>
  );
}
