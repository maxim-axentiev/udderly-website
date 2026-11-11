/** Seed only editable Lovable design placeholders for Goat Yoga. Never edit approved fields. */
import {createReadStream,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {createClient} from '@sanity/client';
const apply=process.argv.includes('--apply');
if(apply && process.env.CONFIRM_LOVABLE_PLACEHOLDERS!=='yes')throw Error('Set CONFIRM_LOVABLE_PLACEHOLDERS=yes to apply');
const auth=JSON.parse(readFileSync(join(homedir(),'.config','sanity','config.json'),'utf8'));
if(!auth.authToken)throw Error('Sanity CLI login required');
const client=createClient({projectId:'umbuxpyp',dataset:'production',apiVersion:'2026-09-08',token:auth.authToken,useCdn:false});
const ids=['experience-goat-yoga','drafts.experience-goat-yoga'];
const docs=await client.fetch('*[_id in $ids]{_id,_rev,designPlaceholders}',{ids},{perspective:'raw'});
const exp=docs.find(doc=>doc._id===ids[0]);
if(!exp||docs.some(doc=>doc._id===ids[1]))throw Error('Goat Yoga missing or contains a conflicting draft');
if(exp.designPlaceholders)throw Error('Design placeholders already present: refusing overwrite');
const root=join(homedir(),'dev','udderly-website','src','assets');
const animals=[
 {name:'Pekoe',lines:['Professional shoelace inspector.','Zero respect for personal space.'],source:join(root,'experiences','goat-icon-1.jpg')},
 {name:'Biscuit',lines:['Placeholder personality copy.','Screams at empty snack bowls. Yours now.'],source:join(root,'herd','goat-icon-2.jpg')},
 {name:'Marshmallow',lines:['Placeholder personality copy.','Falls asleep on laps within 90 seconds.'],source:join(root,'experiences','goat-icon-3.jpg')}
];
const reviews=[
 {name:'Marissa T.',quote:'Placeholder review copy. We booked goat cuddles on a whim and it turned into the best hour of our whole trip. The staff know every single goat by name and personality, and they never rush you. One of the little ones fell asleep on my lap and I have genuinely not stopped thinking about it since. Worth the drive from Toronto, and then some.'},
 {name:'Dev P.',quote:'Placeholder review copy. Small group, unhurried, and the goats clearly love it here. Not a petting zoo at all.'},
 {name:'Joanne R.',quote:'Placeholder review copy. My daughter is nervous around animals and the team let her go completely at her own pace. By the end she was sitting in the straw with three goats in her lap. Truly lovely people who put the animals first.'},
 {name:'Kyle B.',quote:'Placeholder review copy. Ten out of ten. One goat untied my shoelaces twice. I would let her do it again.'}
];
console.log('SOURCE=Lovable/ExperiencePageTemplate.tsx');
console.log('MODE='+(apply?'APPLY':'DRY_RUN'));
console.log('SCOPE=Goat Yoga designPlaceholders only; 4 review placeholders, 3 animal placeholders, welfare, awards strip');
if(apply){
for(let i=0;i<animals.length;i++){
 const item=animals[i];
 const asset=await client.assets.upload('image',createReadStream(item.source),{filename:'lovable-goat-yoga-placeholder-'+(i+1)+'.jpg'});
 if(!asset?._id)throw Error('Upload failed for '+item.name);
 item.image={_type:'altImage',asset:{_type:'reference',_ref:asset._id},alt:'Lovable design placeholder photo for '+item.name};
 delete item.source;
 console.log('PLACEHOLDER_IMAGE_UPLOADED='+item.name);
}
const designPlaceholders={
 enabled:true,awardsEnabled:true,
 reviewsHeading:'People came for goats. They left different.',
 reviews:reviews.map((review,i)=>({_type:'object',_key:'lovable-review-'+i,...review})),
 animalsHeading:'Meet some of\nthe icons.',
 animalsIntro:'There are a lot more animals than this. These are just a few of the personalities who might climb on you.',
 animals:animals.map((animal,i)=>({_type:'object',_key:'lovable-animal-'+i,...animal})),
 welfareHeading:'Happy goats.\nHappy humans.',
 welfareBody:'Placeholder copy. Small groups, short shifts, real rest, enrichment and a quiet space no human is allowed into. Most importantly, the animals choose — lap or nap, both are allowed.',
 welfareImage:animals[1].image,
};
await client.patch(exp._id).ifRevisionId(exp._rev).set({designPlaceholders}).commit();
const check=await client.fetch('*[_id=="experience-goat-yoga"][0]{_id,designPlaceholders}',{},{perspective:'published'});
if(check?.designPlaceholders?.reviews?.length!==4||check.designPlaceholders.animals?.length!==3)throw Error('Published placeholder count did not match');
console.log('PUBLISHED=Goat Yoga design placeholders only, other CMS fields untouched');
}
