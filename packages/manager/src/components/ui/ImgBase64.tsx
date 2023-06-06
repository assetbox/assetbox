type ImgBase64Props = {
  base64Image: string;
};
export const ImgBase64 = ({
  base64Image,
  ...props
}: ImgBase64Props & React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={base64Image} alt={props.alt} {...props} />
);
