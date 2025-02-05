/** @jest-environment jsdom */
/// <reference types="react" />

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import React from 'react';

// Mock Radix UI components globally
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children }: any) => React.createElement('div', null, children),
}));

jest.mock('@radix-ui/react-tooltip', () => {
  const createComponent = (name: string) => {
    const Component = ({ children }: any) => React.createElement('div', null, children);
    Component.displayName = name;
    return Component;
  };

  const TooltipPrimitive = {
    Root: createComponent('Tooltip'),
    Trigger: createComponent('TooltipTrigger'),
    Portal: createComponent('TooltipPortal'),
    Content: createComponent('TooltipContent'),
    Provider: createComponent('TooltipProvider'),
  };

  return {
    Root: TooltipPrimitive.Root,
    Trigger: TooltipPrimitive.Trigger,
    Portal: TooltipPrimitive.Portal,
    Content: TooltipPrimitive.Content,
    Provider: TooltipPrimitive.Provider,
    default: TooltipPrimitive,
  };
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      forEach: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      toString: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    return React.createElement('img', { ...props, alt: props.alt });
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef((props: any, ref: any) => 
      React.createElement('div', { ...props, ref }, props.children)
    ),
    form: React.forwardRef((props: any, ref: any) => 
      React.createElement('form', { ...props, ref }, props.children)
    ),
  },
  AnimatePresence: function MockAnimatePresence(props: any) {
    return React.createElement(React.Fragment, null, props.children);
  },
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Add TextEncoder and TextDecoder to global scope
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock console.error to fail tests on React errors
const originalError = console.error;
console.error = (...args: any[]) => {
  originalError(...args);
  if (args[0]?.includes?.('Warning:')) return;
  throw new Error('Console error was called. See above for details.');
}; 