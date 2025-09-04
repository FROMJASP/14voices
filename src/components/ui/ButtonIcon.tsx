import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Plus,
  Download,
  ExternalLink,
  MailCheck,
  Mail,
  Phone,
  Send,
  MessageCircle,
  Info,
  ChevronRight,
  Check,
  Star,
  Heart,
  Zap,
  Sparkles,
  Calendar,
  Clock,
  FileText,
  Headphones,
  Mic,
  Music,
} from 'lucide-react';

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
    case 'mail-check':
      return <MailCheck {...iconProps} />;
    case 'mail':
      return <Mail {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'send':
      return <Send {...iconProps} />;
    case 'message-circle':
      return <MessageCircle {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
    case 'chevron-right':
      return <ChevronRight {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'heart':
      return <Heart {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'file-text':
      return <FileText {...iconProps} />;
    case 'headphones':
      return <Headphones {...iconProps} />;
    case 'mic':
      return <Mic {...iconProps} />;
    case 'music':
      return <Music {...iconProps} />;
    default:
      return null;
  }
}
