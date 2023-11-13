export type ImageInfo = {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  type: string;
  themes: string;
  colorinvertable: boolean;
  contenttype: string;
};

export type Subpod = {
  title: string;
  img: ImageInfo;
  plaintext: string;
};

export type Pod = {
  title: string;
  scanner: string;
  id: string;
  position: number;
  error: boolean;
  numsubpods: number;
  subpods: Subpod[];
  expressiontypes?: { name: string };
  states?: { name: string; input: string }[];
};

export type QueryResult = {
  success: boolean;
  error: boolean;
  numpods: number;
  datatypes: string;
  timedout: string;
  timedoutpods: string;
  timing: number;
  parsetiming: number;
  parsetimedout: boolean;
  recalculate: string;
  id: string;
  host: string;
  server: string;
  related: string;
  version: string;
  inputstring: string;
  pods: Pod[];
};

export type WolframAlphaResponse = {
  queryresult: QueryResult;
};
