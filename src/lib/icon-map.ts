import {
  HeartHandshake, Sparkles, Brain, Activity, Users,
  ShieldCheck, UserCheck, BookCheck, MapPin,
  Lock, GraduationCap, Award, BookOpen, Globe, Star,
  Sun, Moon, Leaf, Feather, Compass, Heart, Flower2,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "heart-handshake": HeartHandshake,
  "sparkles": Sparkles,
  "brain": Brain,
  "activity": Activity,
  "users": Users,
  "shield-check": ShieldCheck,
  "user-check": UserCheck,
  "book-check": BookCheck,
  "map-pin": MapPin,
  "lock": Lock,
  "graduation-cap": GraduationCap,
  "award": Award,
  "book-open": BookOpen,
  "globe": Globe,
  "star": Star,
  "sun": Sun,
  "moon": Moon,
  "leaf": Leaf,
  "feather": Feather,
  "compass": Compass,
  "heart": Heart,
  "flower": Flower2,
  "user": HeartHandshake,
};

export function getIcon(name?: string): LucideIcon {
  return iconMap[name ?? ""] ?? HeartHandshake;
}
