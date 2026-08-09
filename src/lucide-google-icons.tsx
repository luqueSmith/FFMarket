/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GoogleIconProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const createIcon = (lucideName: string, symbolName: string) => {
  const IconComponent: React.FC<GoogleIconProps> = ({
    size,
    color,
    className = '',
    style,
    ...props
  }) => {
    return (
      <span
        className={`material-symbols-outlined select-none inline-flex items-center justify-center ${className}`}
        style={{
          fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : undefined,
          color: color || 'currentColor',
          verticalAlign: 'middle',
          ...style
        }}
        {...props}
      >
        {symbolName}
      </span>
    );
  };
  
  IconComponent.displayName = lucideName;
  return IconComponent;
};

// Explicit exports for all Lucide Icons mapped to Google Fonts Material Symbols
export const Flame = createIcon('Flame', 'local_fire_department');
export const Search = createIcon('Search', 'search');
export const SlidersHorizontal = createIcon('SlidersHorizontal', 'tune');
export const ChevronLeft = createIcon('ChevronLeft', 'chevron_left');
export const ChevronRight = createIcon('ChevronRight', 'chevron_right');
export const ShieldCheck = createIcon('ShieldCheck', 'verified_user');
export const Check = createIcon('Check', 'check');
export const ChevronDown = createIcon('ChevronDown', 'expand_more');
export const Mail = createIcon('Mail', 'mail');
export const Send = createIcon('Send', 'send');
export const HelpCircle = createIcon('HelpCircle', 'help');
export const Gem = createIcon('Gem', 'diamond');
export const Award = createIcon('Award', 'workspace_premium');
export const Layers = createIcon('Layers', 'layers');
export const Server = createIcon('Server', 'dns');
export const Star = createIcon('Star', 'star');
export const Tv = createIcon('Tv', 'tv');
export const Heart = createIcon('Heart', 'favorite');
export const ShoppingCart = createIcon('ShoppingCart', 'shopping_cart');
export const MessageSquare = createIcon('MessageSquare', 'chat');
export const AlertCircle = createIcon('AlertCircle', 'warning');
export const Clock = createIcon('Clock', 'schedule');
export const ThumbsUp = createIcon('ThumbsUp', 'thumb_up');
export const ThumbsDown = createIcon('ThumbsDown', 'thumb_down');
export const Coins = createIcon('Coins', 'monetization_on');
export const FileText = createIcon('FileText', 'description');
export const Shield = createIcon('Shield', 'shield');
export const Users = createIcon('Users', 'group');
export const ShoppingBag = createIcon('ShoppingBag', 'shopping_bag');
export const Flag = createIcon('Flag', 'flag');
export const Percent = createIcon('Percent', 'percent');
export const Settings = createIcon('Settings', 'settings');
export const UserCheck = createIcon('UserCheck', 'person_check');
export const UserPlus = createIcon('UserPlus', 'person_add');
export const AlertOctagon = createIcon('AlertOctagon', 'report');
export const Trash2 = createIcon('Trash2', 'delete');
export const CheckCircle = createIcon('CheckCircle', 'check_circle');
export const XCircle = createIcon('XCircle', 'cancel');
export const Key = createIcon('Key', 'key');
export const Eye = createIcon('Eye', 'visibility');
export const Plus = createIcon('Plus', 'add');
export const DollarSign = createIcon('DollarSign', 'attach_money');
export const TrendingUp = createIcon('TrendingUp', 'trending_up');
export const Gamepad2 = createIcon('Gamepad2', 'sports_esports');
export const Zap = createIcon('Zap', 'electric_bolt');
export const PlusCircle = createIcon('PlusCircle', 'add_circle');
export const ArrowUpRight = createIcon('ArrowUpRight', 'arrow_outward');
export const User = createIcon('User', 'person');
export const Gift = createIcon('Gift', 'redeem');
export const Bell = createIcon('Bell', 'notifications');
export const LogOut = createIcon('LogOut', 'logout');
export const Trash = createIcon('Trash', 'delete');
export const LifeBuoy = createIcon('LifeBuoy', 'support');
export const Copy = createIcon('Copy', 'content_copy');
export const Sparkles = createIcon('Sparkles', 'auto_awesome');
export const Calendar = createIcon('Calendar', 'calendar_today');

// Extra fallbacks for complete robustness
export const ArrowRight = createIcon('ArrowRight', 'arrow_forward');
export const Lock = createIcon('Lock', 'lock');
export const Unlock = createIcon('Unlock', 'lock_open');
export const Info = createIcon('Info', 'info');
export const X = createIcon('X', 'close');
export const ChevronUp = createIcon('ChevronUp', 'expand_less');
export const Play = createIcon('Play', 'play_arrow');
export const Pause = createIcon('Pause', 'pause');
export const Volume2 = createIcon('Volume2', 'volume_up');
export const VolumeX = createIcon('VolumeX', 'volume_off');
export const Filter = createIcon('Filter', 'filter_alt');
export const BookOpen = createIcon('BookOpen', 'book');
export const Phone = createIcon('Phone', 'call');
export const Receipt = createIcon('Receipt', 'receipt_long');
export const Printer = createIcon('Printer', 'print');
export const ExternalLink = createIcon('ExternalLink', 'open_in_new');
export const CheckCircle2 = createIcon('CheckCircle2', 'check_circle');
export const Store = createIcon('Store', 'storefront');
export const Globe = createIcon('Globe', 'language');
export const Share2 = createIcon('Share2', 'share');
