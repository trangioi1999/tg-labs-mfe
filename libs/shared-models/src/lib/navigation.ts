export interface NavItem {
  label: string;
  /** Absolute router path, e.g. `/blog`. */
  path: string;
  description?: string;
  /** Use `exact` matching for `routerLinkActive` (needed for `/`). */
  exact?: boolean;
}
