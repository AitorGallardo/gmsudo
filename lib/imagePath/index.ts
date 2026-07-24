export const getImagePath = (src: string) => {
  // const basePath = process.env.NODE_ENV === "production" ? "/portfolio-v1" : "";
  const basePath = "/portfolio-v1";
  return `${basePath}${src}`;
};
