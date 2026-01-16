declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly MODE: "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
