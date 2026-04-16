/**
 * Homepage section components barrel export.
 */

export { default as BrowseByCategory } from './BrowseByCategory';
export { default as Testimonials } from './Testimonials';
export { default as WhyChooseUs } from './WhyChooseUs';
export { default as RecentlyViewed } from './RecentlyViewed';
export { default as PopularInArea } from './PopularInArea';
export { default as LazyImage } from './LazyImage';

// Re-export utilities
export { addRecentlyViewed, getRecentlyViewed } from './RecentlyViewed';
export type { RecentVendor } from './RecentlyViewed';
