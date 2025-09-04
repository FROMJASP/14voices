import { ArrowRight, ArrowUpRight, Play, Plus, Download, ExternalLink } from 'lucide-react';

interface ButtonIconProps {
  icon: string;
  className?: string;
}

export function ButtonIcon({ icon, className }: ButtonIconProps) {
  const iconProps = {
    className: className || '!h-5 !w-5',
  };

  switch (icon) {
    case 'arrow-right':
      return <ArrowRight {...iconProps} />;
    case 'arrow-up-right':
      return <ArrowUpRight {...iconProps} />;
    case 'play':
      return <Play {...iconProps} />;
    case 'plus':
      return <Plus {...iconProps} />;
    case 'download':
      return <Download {...iconProps} />;
    case 'external-link':
      return <ExternalLink {...iconProps} />;
    default:
      return null;
  }
}
