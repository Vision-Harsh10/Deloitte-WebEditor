export interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface WebsiteContent {
  pages: {
    [key: string]: {
      title: string;
      content: string;
      images: {
        [key: string]: ImageData;
      };
    };
  };
}

export interface WebsiteStyle {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
  };
  spacing: {
    padding: string;
    margin: string;
  };
}

export interface WebsiteConfig {
  content: WebsiteContent;
  style: WebsiteStyle;
}

export interface EditHistory {
  [elementId: string]: {
    text?: string;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    image?: string;
    styles?: {
      [key: string]: string;
    };
    layout?: {
      [key: string]: string;
    };
    src?: string;
  };
} 