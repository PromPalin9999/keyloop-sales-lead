export const getComputedCssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const readThemeVariables = () => ({
  text: getComputedCssVar('--text'),
  background: getComputedCssVar('--background'),
  accent: getComputedCssVar('--accent'),
  success: getComputedCssVar('--success'),
  info: getComputedCssVar('--info'),
  warning: getComputedCssVar('--warning'),
  error: getComputedCssVar('--error'),
  primary: getComputedCssVar('--primary'),
});
