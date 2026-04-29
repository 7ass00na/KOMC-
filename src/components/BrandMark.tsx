import Image from "next/image";
import { BRAND_LOGO_PATH } from "@/lib/brandAssets";

type BrandMarkProps = {
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  src?: string;
};

export default function BrandMark({
  alt,
  containerClassName = "h-8 w-8",
  imageClassName = "p-[2px]",
  sizes = "32px",
  priority = false,
  src = BRAND_LOGO_PATH,
}: BrandMarkProps) {
  return (
    <div className={`logo-bg ${containerClassName}`}>
      <div className="logo-media">
        <Image
          src={src}
          alt={alt}
          width={512}
          height={512}
          sizes={sizes}
          className={`logo-image ${imageClassName}`}
          priority={priority}
        />
      </div>
    </div>
  );
}
