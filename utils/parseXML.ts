import * as xml2js from "xml2js";

export const parseXML = async (xml: string): Promise<any> => {
  return await xml2js.parseStringPromise(xml, { mergeAttrs: true });
};
