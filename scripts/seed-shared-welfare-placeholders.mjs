/** Populate five editable global welfare placeholders, without touching approved experience fields.
 * Dry-run by default. Apply requires CONFIRM_SHARED_WELFARE_PLACEHOLDERS=yes.
 */
import {createReadStream,readFileSync,writeFileSync} from 'node:fs';
import {homedir,tmpdir} from 'node:os';
import {join} from 'node:path';
import {createClient} from '@sanity/client';

const apply=process.argv.includes('--apply');
if(apply && process.env.CONFIRM_SHARED_WELFARE_PLACEHOLDERS!=='yes')throw Error('Explicit approval required');
const token=JSON.parse(readFileSync(join(homedir(),'.config','sanity','config.json'),'utf8')).authToken;
if(!token)throw Error('Sanity CLI authentication missing');
const client=createClient({projectId:'umbuxpyp',dataset:'production',apiVersion:'2026-09-08',token,useCdn:false});
const ids=['siteSettings','drafts.siteSettings','experience-goat-yoga'];
const docs=await client.fetch('*[_id in $ids]{_id,_rev,experienceWelfareProfiles,designPlaceholders}',{ids},{perspective:'raw'});
const site=docs.find(x=>x._id==='siteSettings');
const goatYoga=docs.find(x=>x._id==='experience-goat-yoga');
if(!site||!goatYoga||docs.some(x=>x._id==='drafts.siteSettings'))throw Error('Missing source or site settings has a draft: no change');
if(site.experienceWelfareProfiles)throw Error('Shared welfare profiles already exist: refuse overwrite');
const goat=goatYoga.designPlaceholders;
if(goat?.enabled!==true||!goat.welfareBody||!goat.welfareImage?.asset?._ref)throw Error('Goat Yoga source placeholder is incomplete');
const herd=join(homedir(),'dev','udderly-website','src','assets','herd');
const data=[
  {key:'goats',heading:goat.welfareHeading||'Happy goats.\nHappy humans.',body:goat.welfareBody,photo:goat.welfareImage},
  {key:'cows',heading:'Happy cows.\nHappy humans.',body:'Placeholder copy. Add the approved cow welfare information here.',file:join(herd,'highland-hero.jpg'),alt:'Placeholder photo of Highland cows at the farm'},
  {key:'donkeys',heading:'Happy donkeys.\nHappy humans.',body:'Placeholder copy. Add the approved donkey welfare information here.',file:join(herd,'donkey-picnic.jpg'),alt:'Placeholder photo of miniature donkeys at the farm'},
  {key:'alpacas',heading:'Happy alpacas.\nHappy humans.',body:'Placeholder copy. Add the approved alpaca welfare information here.',file:join(herd,'alpaca-walk.jpg'),alt:'Placeholder photo of alpacas at the farm'},
  {key:'mixed',heading:'Happy animals.\nHappy humans.',body:'Placeholder copy. Add the approved welfare information for experiences featuring multiple animal species here.',file:join(herd,'goat-icon-2.jpg'),alt:'Placeholder photo of farm animals'},
];
console.log('MODE='+(apply?'APPLY':'DRY_RUN'));
console.log('SCOPE=siteSettings.experienceWelfareProfiles only; '+data.map(x=>x.key).join(','));
for(const item of data){if(!item.heading||!item.body)throw Error('Incomplete placeholder for '+item.key);}
if(apply){
  const backup=join(tmpdir(),'udderly-site-settings-welfare-backup-'+Date.now()+'.json');
  writeFileSync(backup,JSON.stringify(site,null,2));
  console.log('BACKUP_SAVED='+backup);
  for(const entry of data.filter(x=>x.file)){
    const asset=await client.assets.upload('image',createReadStream(entry.file),{filename:'udderly-welfare-placeholder-'+entry.key+'.jpg'});
    if(!asset?._id?.startsWith('image-'))throw Error('Asset upload failed for '+entry.key);
    entry.photo={_type:'altImage',alt:entry.alt,asset:{_type:'reference',_ref:asset._id}};
    console.log('IMAGE_UPLOADED='+entry.key);
  }
  const profiles={_type:'object'};
  for(const entry of data)profiles[entry.key]={_type:'object',heading:entry.heading,body:entry.body,image:entry.photo};
  await client.patch(site._id).ifRevisionId(site._rev).set({experienceWelfareProfiles:profiles}).commit();
  const live=await client.fetch('*[_id=="siteSettings"][0].experienceWelfareProfiles',{},{perspective:'published'});
  if(data.some(x=>!live?.[x.key]?.image?.asset?._ref||!live[x.key]?.body))throw Error('Post-publish verification failed');
  console.log('PUBLISHED_AND_VERIFIED=5_shared_welfare_profiles');
}
