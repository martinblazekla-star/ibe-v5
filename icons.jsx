// Icon set — small inline SVGs only. No hand-drawn complex imagery.
const Icon = ({ name, size = 16, color = "currentColor", strokeWidth = 2 }) => {
  const stroke = color;
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
    style: { display: "block", flexShrink: 0 },
  };
  switch (name) {
    case "bed":
      return <svg {...props}><path d="M2 17v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v5" /><path d="M2 19h20" /><path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /></svg>;
    case "person":
      return <svg {...props}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6" /></svg>;
    case "size":
      return <svg {...props}><path d="M21 15v6h-6" /><path d="M3 9V3h6" /><path d="M21 21l-7-7" /><path d="M3 3l7 7" /></svg>;
    case "view":
      return <svg {...props}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "wifi":
      return <svg {...props}><path d="M5 12.55a11 11 0 0 1 14 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="4" width="18" height="17" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>;
    case "users":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "voucher":
      return <svg {...props}><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" /><line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 2" /></svg>;
    case "chevron-down":
      return <svg {...props}><polyline points="6 9 12 15 18 9" /></svg>;
    case "chevron-up":
      return <svg {...props}><polyline points="18 15 12 9 6 15" /></svg>;
    case "chevron-right":
      return <svg {...props}><polyline points="9 18 15 12 9 6" /></svg>;
    case "check":
      return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>;
    case "x":
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case "info":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
    case "plus":
      return <svg {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case "minus":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "list":
      return <svg {...props}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
    case "table":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /></svg>;
    case "flame":
      return <svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>;
    case "tag":
      return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case "filter":
      return <svg {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
    case "image":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
    case "leaf":
      return <svg {...props}><path d="M6 21c0-7 7-13 14-13 0 7-6 13-13 13-1 0-1 0-1 0z" /><path d="M6 21c0-5 3-9 8-11" /></svg>;
    case "sparkle":
      return <svg {...props}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /></svg>;
    case "star":
      return <svg {...props} fill={color}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case "star-outline":
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case "map-pin":
      return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "phone":
      return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    case "mail":
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case "car":
      return <svg {...props}><path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" /><path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v4H3v-4z" /></svg>;
    case "train":
      return <svg {...props}><rect x="5" y="3" width="14" height="14" rx="3" /><line x1="5" y1="11" x2="19" y2="11" /><circle cx="9" cy="14" r="0.6" fill={color} /><circle cx="15" cy="14" r="0.6" fill={color} /><path d="M8 21l-2 1M16 21l2 1" /></svg>;
    case "plane":
      return <svg {...props}><path d="M17.8 19.2l-3.8-7.5L21 8l-1.5-1.5L13 9.5 8.5 2 7 3.5l2.5 6.5L4 14l-2-.5L1 15l3 1 1 3 1.5-1L6 14l4-2 6.5 2.5 1.3-.3z" /></svg>;
    case "walk":
      return <svg {...props}><circle cx="13" cy="4" r="2" /><path d="M8 21l3-7 2-3" /><path d="M11 11l-2-2-3 3 2 3" /><path d="M13 14l4 4-1 3" /><path d="M15 9l3 3 3-1" /></svg>;
    case "copy":
      return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
    case "navigation":
      return <svg {...props}><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;
    case "globe":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" /></svg>;
    case "thumbs-up":
      return <svg {...props}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9A2 2 0 0 0 19.66 9H14z" /><line x1="7" y1="22" x2="7" y2="11" /></svg>;
    case "book":
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    case "heart":
      return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
    case "tram":
      return <svg {...props}><rect x="4" y="3" width="16" height="16" rx="3" /><line x1="4" y1="11" x2="20" y2="11" /><circle cx="8.5" cy="15.5" r="0.7" fill={color} /><circle cx="15.5" cy="15.5" r="0.7" fill={color} /><path d="M9 22l-1 1M15 22l1 1" /><line x1="10" y1="3" x2="10" y2="1" /><line x1="14" y1="3" x2="14" y2="1" /></svg>;
    case "concierge":
      return <svg {...props}><path d="M3 18h18" /><path d="M5 18a7 7 0 0 1 14 0" /><circle cx="12" cy="6" r="2" /><line x1="12" y1="8" x2="12" y2="11" /></svg>;
    case "dot":
      return <svg {...props}><circle cx="12" cy="12" r="2" fill={color} /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
};

window.Icon = Icon;
