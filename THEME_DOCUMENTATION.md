# 🎨 Asphalt OverWatch Operations System - Theme Documentation

## 🎯 Industrial Asphalt Theme Overview

This document provides complete specifications for the **Industrial Asphalt Theme** used in the Asphalt OverWatch Operations System. This theme can be replicated across multiple projects by following these exact specifications.

---

## 🎨 Color Palette & Design Tokens

### **Core Colors (HSL Format)**
```css
/* Primary Industrial Orange */
--primary: 25 95% 53%;                    /* #FF8C00 - Construction Orange */
--primary-foreground: 210 25% 8%;         /* Dark text on orange */

/* Industrial Blue Accent */
--accent: 220 91% 60%;                    /* #1E90FF - Industrial Blue */
--accent-foreground: 210 25% 8%;         /* Dark text on blue */

/* Dark Theme Base */
--background: 210 30% 4%;                 /* #0A0E14 - Deep Dark */
--foreground: 210 40% 98%;                /* #F8FAFC - Light text */

/* Surface Colors */
--card: 210 30% 8%;                       /* #141A22 - Card background */
--card-foreground: 210 40% 98%;           /* Light text on cards */

--secondary: 210 30% 12%;                 /* #1F2937 - Secondary surface */
--secondary-foreground: 210 40% 98%;      /* Light text on secondary */

--muted: 210 30% 12%;                     /* #1F2937 - Muted elements */
--muted-foreground: 210 25% 70%;          /* #94A3B8 - Muted text */

/* Border & Input */
--border: 210 30% 16%;                    /* #374151 - Borders */
--input: 210 30% 12%;                     /* #1F2937 - Input backgrounds */
--ring: 25 95% 53%;                       /* Orange focus rings */
```

### **Extended Industrial Palette**
```css
/* Industrial Theme Specific */
--industrial-orange: 25 95% 53%;          /* Primary construction orange */
--industrial-blue: 220 91% 60%;           /* Industrial machinery blue */
--industrial-dark: 210 25% 8%;            /* Deep industrial dark */
--industrial-surface: 210 25% 12%;        /* Surface panels */
--industrial-border: 210 25% 20%;         /* Panel borders */
```

### **Gradients**
```css
/* Primary Gradient - Orange to Yellow */
--gradient-primary: linear-gradient(135deg, hsl(25 95% 53%), hsl(35 95% 58%));

/* Surface Gradient - Dark to Darker */
--gradient-surface: linear-gradient(180deg, hsl(210 25% 12%), hsl(210 25% 10%));

/* Accent Gradient - Blue variations */
--gradient-accent: linear-gradient(135deg, hsl(220 91% 60%), hsl(230 91% 65%));
```

### **Shadows & Effects**
```css
/* Industrial Shadow - Deep with opacity */
--shadow-industrial: 0 10px 30px -5px hsl(210 25% 4% / 0.3);

/* Glow Effect - Orange glow for highlights */
--shadow-glow: 0 0 40px hsl(25 95% 53% / 0.15);
```

---

## 🔧 Typography System

### **Font Configuration**
```css
/* Primary Font: Inter (System) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Monospace: JetBrains Mono */
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### **Font Scale**
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* Hero titles */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* Section titles */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* Card titles */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* Large text */

/* Body Text */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }  /* Large body */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* Standard body */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* Small text */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* Extra small */
```

---

## 🧩 Component System

### **Button Variants**
```typescript
// Primary Button - Orange with white text
variant: "default" | "primary"
className: "bg-primary text-primary-foreground hover:bg-primary/90"

// Secondary Button - Dark with border
variant: "secondary"
className: "bg-secondary text-secondary-foreground hover:bg-secondary/80"

// Accent Button - Blue theme
variant: "accent"
className: "bg-accent text-accent-foreground hover:bg-accent/90"

// Outline Button - Transparent with orange border
variant: "outline"
className: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"

// Ghost Button - Minimal with hover effect
variant: "ghost"
className: "hover:bg-secondary hover:text-secondary-foreground"

// Destructive Button - Red theme for dangerous actions
variant: "destructive"
className: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
```

### **Card Styling**
```css
/* Standard Card */
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: var(--shadow-industrial);
}

/* Enhanced Card with Glow */
.card-enhanced {
  background: var(--gradient-surface);
  border: 1px solid hsl(var(--industrial-border));
  box-shadow: var(--shadow-industrial), var(--shadow-glow);
}

/* Interactive Card */
.card-interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-industrial), var(--shadow-glow);
}
```

### **Badge System**
```typescript
// Status Badges

"success": "bg-green-500/10 text-green-400 border-green-500/20"
"warning": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
"error": "bg-red-500/10 text-red-400 border-red-500/20"
"info": "bg-blue-500/10 text-blue-400 border-blue-500/20"
"primary": "bg-primary/10 text-primary border-primary/20"
```

---

## 📐 Layout & Spacing

### **Container System**
```css
/* Max widths */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }

/* Section Spacing */
.section-padding { padding: 3rem 0; }      /* 48px top/bottom */
.section-padding-lg { padding: 4rem 0; }   /* 64px top/bottom */
.section-padding-xl { padding: 6rem 0; }   /* 96px top/bottom */
```

### **Grid System**
```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
```

---

## 🎭 Animation System

### **Transitions**
```css
/* Standard Transition */
.transition-smooth { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

/* Hover Effects */
.hover-lift:hover { transform: translateY(-2px); }
.hover-scale:hover { transform: scale(1.02); }
.hover-glow:hover { box-shadow: var(--shadow-glow); }
```

### **Loading States**
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground)/0.1) 50%, hsl(var(--muted)) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 🖼️ Hero Section Design

### **Background System**
```css
/* Hero Background */
.hero-bg {
  background-image: 
    linear-gradient(135deg, hsl(var(--background)/0.9), hsl(var(--background)/0.7)),
    url('/assets/hero-asphalt.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* Overlay Gradient */
.hero-overlay {
  background: linear-gradient(
    135deg, 
    hsl(var(--background)/0.95) 0%, 
    hsl(var(--background)/0.8) 50%, 
    hsl(var(--background)/0.9) 100%
  );
}
```

### **Hero Content Layout**
```css
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 0;
  min-height: 80vh;
  justify-content: center;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}
```

---

## 📊 Dashboard Components

### **KPI Card Design**
```css
.kpi-card {
  background: var(--gradient-surface);
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: hsl(var(--primary));
  line-height: 1;
}

.kpi-label {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### **Status Indicators**
```css
/* Pulse Animation for Live Status */
.status-pulse {
  position: relative;
}

.status-pulse::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: hsl(var(--primary));
  opacity: 0.3;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  70% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
}
```

---

## 🎨 Theme Implementation Guide

### **1. CSS Variables Setup**
```css
/* Add to index.css */
@layer base {
  :root {
    /* Copy all color variables from above */
    --background: 210 25% 8%;
    --foreground: 210 40% 98%;

    --card: 210 25% 12%;
    --card-foreground: 210 40% 98%;

    --popover: 210 25% 12%;
    --popover-foreground: 210 40% 98%;

    --primary: 25 95% 53%;
    --primary-foreground: 210 25% 8%;

    --secondary: 210 25% 16%;
    --secondary-foreground: 210 40% 98%;

    --muted: 210 25% 16%;
    --muted-foreground: 210 20% 65%;

    --accent: 220 91% 60%;
    --accent-foreground: 210 25% 8%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    --border: 210 25% 20%;
    --input: 210 25% 16%;
    --ring: 25 95% 53%;
    
    /* Industrial Theme Colors */
    --industrial-orange: 25 95% 53%;
    --industrial-blue: 220 91% 60%;
    --industrial-dark: 210 25% 8%;
    --industrial-surface: 210 25% 12%;
    --industrial-border: 210 25% 20%;
    
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, hsl(25 95% 53%), hsl(35 95% 58%));
    --gradient-surface: linear-gradient(180deg, hsl(210 25% 12%), hsl(210 25% 10%));
    --gradient-accent: linear-gradient(135deg, hsl(220 91% 60%), hsl(230 91% 65%));
    
    /* Shadows */
    --shadow-industrial: 0 10px 30px -5px hsl(210 25% 4% / 0.3);
    --shadow-glow: 0 0 40px hsl(25 95% 53% / 0.15);

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;

    --sidebar-foreground: 240 5.3% 26.1%;

    --sidebar-primary: 240 5.9% 10%;

    --sidebar-primary-foreground: 0 0% 98%;

    --sidebar-accent: 240 4.8% 95.9%;

    --sidebar-accent-foreground: 240 5.9% 10%;

    --sidebar-border: 220 13% 91%;

    --sidebar-ring: 217.2 91.2% 59.8%;
  }
  
  .dark {
    /* Dark theme overrides */
    --background: 210 30% 4%;
    --foreground: 210 40% 98%;

    --card: 210 30% 8%;
    --card-foreground: 210 40% 98%;

    --popover: 210 30% 8%;
    --popover-foreground: 210 40% 98%;

    --primary: 25 95% 53%;
    --primary-foreground: 210 30% 4%;

    --secondary: 210 30% 12%;
    --secondary-foreground: 210 40% 98%;

    --muted: 210 30% 12%;
    --muted-foreground: 210 25% 70%;

    --accent: 220 91% 60%;
    --accent-foreground: 210 30% 4%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    --border: 210 30% 16%;
    --input: 210 30% 12%;
    --ring: 25 95% 53%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

### **2. Tailwind Configuration**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        industrial: {
          orange: 'hsl(var(--industrial-orange))',
          blue: 'hsl(var(--industrial-blue))',
          dark: 'hsl(var(--industrial-dark))',
          surface: 'hsl(var(--industrial-surface))',
          border: 'hsl(var(--industrial-border))',
        },
        border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-surface': 'var(--gradient-surface)',
        'gradient-accent': 'var(--gradient-accent)',
      },
      boxShadow: {
        'industrial': 'var(--shadow-industrial)',
        'glow': 'var(--shadow-glow)',
      },
    },
  },
}
```

### **3. Component Styling Pattern**
```typescript
// Use semantic tokens consistently
<Card className="bg-card border-border shadow-industrial">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    Content
  </CardContent>
</Card>

// For interactive elements
<Button 
  variant="default" 
  className="bg-primary hover:bg-primary/90 text-primary-foreground"
>
  Action
</Button>
```

---

## 🔄 Theme Replication Checklist

To replicate this theme in another project:

### **✅ Setup Steps**
1. **Copy CSS Variables** - All color tokens from index.css
2. **Configure Tailwind** - Extended color palette and utilities
3. **Add Font Imports** - Inter and JetBrains Mono fonts
4. **Setup Component Library** - shadcn/ui with custom variants
5. **Add Background Assets** - Industrial/construction imagery
6. **Implement Animation System** - CSS keyframes and transitions

### **✅ Component Checklist**
- [ ] Button variants (6 types)
- [ ] Card layouts (3 variants)
- [ ] Badge system (5 status types)
- [ ] Form components with theme
- [ ] Navigation with industrial styling
- [ ] Dashboard layout grid
- [ ] KPI cards with gradients
- [ ] Status indicators with pulse animation

### **✅ Testing**
- [ ] Dark/light theme switching
- [ ] Mobile responsiveness
- [ ] Accessibility contrast ratios
- [ ] Animation performance
- [ ] Cross-browser compatibility

---

## 📱 Responsive Breakpoints
```css
/* Mobile First Approach */
/* xs: 0px - 640px (default) */
/* sm: 640px */
@media (min-width: 640px) { }

/* md: 768px */
@media (min-width: 768px) { }

/* lg: 1024px */
@media (min-width: 1024px) { }

/* xl: 1280px */
@media (min-width: 1280px) { }

/* 2xl: 1536px */
@media (min-width: 1536px) { }
```

---

## 🎯 Industrial Design Principles

1. **Functionality First** - Every element serves a purpose
2. **High Contrast** - Excellent readability in all conditions
3. **Robust Interactions** - Clear hover and active states
4. **Professional Typography** - Clean, readable fonts
5. **Consistent Spacing** - Predictable layout rhythm
6. **Performance Focused** - Optimized animations and effects
7. **Accessibility Compliant** - WCAG 2.1 AA standards

---

This theme documentation provides everything needed to recreate the Industrial Asphalt theme across multiple projects while maintaining consistency and professional quality.
