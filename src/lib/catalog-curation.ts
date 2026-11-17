import type {Product} from './types.ts';
import type {GameId} from './games.ts';

// Editorial ordering only: these IDs point to the existing priced snapshot.
// Search, explicit sorting and category filters still cover the entire inventory.
const picks:Record<GameId,string[]>={
  cs2:['31a1ee91-e4a7-4772-862c-083e5dd1baba','91857a3e-d160-477b-bcd3-6e6dc1e3354b','b9a34810-31ca-4b31-8b56-de87fb598c6b','aa71f575-5b16-4b8d-b922-d4df773b36e8','5d08b483-6b7b-4595-9e4c-498c6d9de3ce','5ec7a50c-5a1c-4a5f-b8e1-37284d36e044'],
  rust:['620634f6-3a40-482a-8e0a-850d0ca0d211','991ad621-f391-49d1-a3a0-a0f3225e0def','0db17a79-4ba9-42d2-8e79-9a656c288517','53d84ed8-a126-4dc0-9a0b-247c59f9cd11'],
  tf2:['8529542e-148f-4bd0-b41e-759cd573e8e5','edef7d94-4cda-47be-8e4e-59f0aeab7682','69cb6f86-3ba6-4327-b793-a369a9d64472','f84b8dcf-3cb1-4559-bf4f-33183675b248'],
};
export function curateCatalog(products:Product[],game:GameId){
  const ranks=new Map(picks[game].map((id,index)=>[`ref-${game}-${id}`,index]));
  return [...products].sort((a,b)=>(ranks.get(a.id)??ranks.size)-(ranks.get(b.id)??ranks.size) || Number(!a.imageUrl)-Number(!b.imageUrl));
}
