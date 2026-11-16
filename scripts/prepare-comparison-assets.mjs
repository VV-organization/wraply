import fs from 'node:fs/promises';
import sharp from 'sharp';

// Keep the real finish artwork: normalize full-size source renders without AI redraws.
const pairs=[
 ['ref-cs2-b6731ad5-d48c-415c-a9e6-b345ba0c4203','m4a1s-black-lotus'],
 ['ref-cs2-d02d287d-b8fc-4d9c-b810-632a7d4af6dd','m4a1s-decimator'],
];
const index=JSON.parse(await fs.readFile('src/data/comparison-art.json','utf8'));
for(const [id,name] of pairs){
 const source=`public/comparison-sources/${name}.webp`;
 const image=await sharp(source).resize({width:1640,withoutEnlargement:true}).toBuffer();
 const meta=await sharp(image).metadata();
 const canvas=sharp({create:{width:1680,height:480,channels:4,background:'#00000000'}});
 const output=`/comparison-art/${name}-hd.webp`;
 await canvas.composite([{input:image,left:20,top:Math.floor((480-meta.height)/2)}]).webp({lossless:true}).toFile('public'+output);
 index[id]=output;
}
await fs.writeFile('src/data/comparison-art.json',JSON.stringify(index,null,2)+'\n');
