import { Link } from "react-router";

import type { Route } from "./+types/home";

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
};

const iconDefaults = { size: 24, strokeWidth: 2 };

function IconBase({
  size = iconDefaults.size,
  className,
  strokeWidth = iconDefaults.strokeWidth,
  fill = "none",
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </IconBase>
  );
}

function BadgeCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconBase>
  );
}

function CheckCircle2(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </IconBase>
  );
}

function Facebook(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 8h-2c-1.1 0-2 .9-2 2v2H8v3h2v5h3v-5h2.2l.8-3H13v-1.6c0-.4.3-.7.7-.7H16V8z" />
    </IconBase>
  );
}

function Instagram(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function Linkedin(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10v6" />
      <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
      <path d="M12 16v-3.5c0-1.7 2-1.8 2-0.1V16" />
    </IconBase>
  );
}

function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

function MapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 4.5h2l1.2 3-2 1.2c.9 2 2.5 3.6 4.5 4.5l1.2-2 3 1.2v2c0 .9-.7 1.6-1.6 1.6-6.3-.5-11.4-5.6-11.8-11.8 0-.9.7-1.6 1.5-1.6z" />
    </IconBase>
  );
}

function Sparkles(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.6 4.4L18 9l-4.4 
