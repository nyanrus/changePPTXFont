import { change_font_xml } from "./parse.ts";
import { TextReader } from "https://deno.land/x/zipjs/index.js";

import { TextWriter, Uint8ArrayWriter, ZipReader, ZipWriter } from "https://deno.land/x/zipjs/index.js";
import { Uint8ArrayReader } from "https://deno.land/x/zipjs/index.js";

console.log("xml change start");

const buf = new Map<string, string>();
const reader = new ZipReader(await Deno.open(Deno.args[0]));
const entries = await reader.getEntries();
for (const i of entries.filter((value) => {
  const name = value.filename;
  return name.startsWith("ppt/slides/slide") && name.endsWith(".xml");
})) {
  const writer = new TextWriter();
  i.getData(writer);
  const str = await writer.getData();
  const changed_str = change_font_xml(str);
  buf.set(i.filename, changed_str);
}

console.log("xml change complete");

console.log("write start");

const writer = new ZipWriter(await Deno.create(Deno.args[0] + ".pptx"));

for (const i of entries) {
  const map_value = buf.get(i.filename);
  if (map_value == null) {
    const buf_writer = new Uint8ArrayWriter();
    const data = await i.getData(buf_writer);

    const buf_reader = new Uint8ArrayReader(data);
    await writer.add(i.filename, buf_reader);
  } else {
    const buf_reader = new TextReader(map_value);
    await writer.add(i.filename, buf_reader);
  }
}

console.log("write end");

console.log("cleaning hander");
await writer.close();
await reader.close();
console.log("done");
