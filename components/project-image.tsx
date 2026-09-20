import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

// Lossless previews keep interface text sharp; original PNGs remain downloadable.
const screenshots = {
  "/tradeflow.png": { preview: "/tradeflow.webp", width: 1241, height: 644 },
  "/img1.png": { preview: "/img1.webp", width: 1307, height: 619 },
  "/img3.png": { preview: "/img3.webp", width: 1275, height: 619 },
} as const;

export default function ProjectImage({
  src,
  name,
  priority = false,
}: {
  src: keyof typeof screenshots;
  name: string;
  priority?: boolean;
}) {
  const screenshot = screenshots[src];

  return (
    <a
      className="project-image"
      href={src}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open full-size ${name} screenshot in a new tab`}
    >
      <Image
        src={screenshot.preview}
        alt={`${name} application interface`}
        width={screenshot.width}
        height={screenshot.height}
        priority={priority}
      />
      <span className="image-expand">
        View full size <ArrowUpRight size={14} aria-hidden="true" />
      </span>
    </a>
  );
}
