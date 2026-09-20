export default function ProjectVideo({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  return (
    <video
      className="project-video"
      controls
      playsInline
      preload="metadata"
      aria-label={`${name} — 15-second demo`}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video. <a href={src}>Download the {name} demo</a>.
    </video>
  );
}
