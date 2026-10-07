import type { Img } from '../data/images';
type P = { img: Img; sizes?: string; className?: string; eager?: boolean; fit?: 'cover' | 'contain' };
export default function ResponsiveImage({ img, sizes = '(min-width:1024px) 50vw, 100vw', className = '', eager, fit = 'cover' }: P) {
  return (
    <img src={img.src} srcSet={img.srcSet} sizes={sizes} width={img.w} height={img.h} alt={img.alt}
      loading={eager ? 'eager' : 'lazy'} decoding="async"
      className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`} />
  );
}
