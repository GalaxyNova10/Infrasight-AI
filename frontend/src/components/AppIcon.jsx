import React from 'react';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, color, size, strokeWidth, className }) => {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    // If the icon name is not found, log a warning and show a fallback icon.
    console.warn(`Icon "${name}" not found in lucide-react.`);
    const FallbackIcon = LucideIcons['HelpCircle']; // A default 'question mark' icon
    return <FallbackIcon color="gray" size={size} strokeWidth={strokeWidth} className={className} />;
  }

  return <LucideIcon color={color} size={size} strokeWidth={strokeWidth} className={className} />;
};

export default Icon;