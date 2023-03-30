import { DOMParser } from "https://esm.sh/linkedom@0.14.25";
import { Document } from "https://esm.sh/v113/linkedom@0.14.25/types/esm/interface/document.d.ts";
import { Element } from "https://esm.sh/v113/linkedom@0.14.25/types/esm/interface/element.d.ts";

import { assert } from "https://deno.land/std@0.178.0/testing/asserts.ts";

interface fontSettings {
  typeface: string;
  panose: string;
  pitchFamily: string;
  charset: string;
}

const notoSansKR: fontSettings = {
  typeface: "Noto Sans KR",
  panose: "020B0500000000000000",
  pitchFamily: "34",
  charset: "-128",
};

function create_font_elem(doc: Document, name: string, fontSettings: fontSettings): Element {
  const a = doc.createElement(name);
  a.setAttribute("typeface", fontSettings.typeface);
  a.setAttribute("panose", fontSettings.panose);
  a.setAttribute("pitchFamily", fontSettings.pitchFamily);
  a.setAttribute("charset", fontSettings.charset);
  return a;
}

export function change_font_xml(str: string, fontSettings: fontSettings = notoSansKR): string {
  const doc = new DOMParser().parseFromString(str, "text/xml");
  assert(doc);

  const fontLatin = create_font_elem(doc, "a:latin", fontSettings);
  const fontEa = create_font_elem(doc, "a:ea", fontSettings);

  for (const i of doc.getElementsByTagName("a:rPr")) {
    // console.log(i);
    if (!i.hasChildNodes()) {
      i.appendChild(fontLatin.cloneNode());
      i.appendChild(fontEa.cloneNode());
    }
  }

  for (const i of doc.getElementsByTagName("a:endParaRPr")) {
    // console.log(i);
    if (!i.hasChildNodes()) {
      i.appendChild(fontLatin.cloneNode());
      i.appendChild(fontEa.cloneNode());
    }
  }

  // console.log(doc);
  //Deno.writeTextFileSync("./slide2.xml.xml", doc.toString().replace(`<?xml version="1.0" encoding="utf-8"?>`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`));
  return doc.toString().replace(`<?xml version="1.0" encoding="utf-8"?>`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`);
}
