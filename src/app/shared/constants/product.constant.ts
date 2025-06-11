// Constants
export const LAYOUT_TYPES = {
    LIST: 'list',
    GRID: 'grid'
} as const;

export const ERROR_MESSAGES = {
    SEARCH_FAILED: 'Search Failed',
    LOAD_FAILED: 'Failed to Load Products'
} as const;


export const PRODUCT_CONSTANTS = {
  CATEGORIES: {
    BEAUTY: 'beauty'
  },
  STOCK_STATUS: {
    LOW: 'Low Stock'
  }
} as const;


/**
 * Constants for default values and configuration
 */
export const DEFAULT_PLACEHOLDER_IMAGE = 'public/placeholder.jpg';
