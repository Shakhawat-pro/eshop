// Allow importing global CSS files for side effects (e.g., import './global.css')
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

// CSS Modules declarations (if used)
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
