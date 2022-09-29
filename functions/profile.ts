import { api, collection } from '@nitric/sdk';
import { uuid } from 'uuidv4';

// Create an api named public
const profileApi = api('public');

// Access profile collection with permissions
const profiles = collection('profiles').for('writing', 'reading');

profileApi.post('/profiles', async (ctx) => {
    let id = uuid();
    let name = ctx.req.json().name;
    let age = ctx.req.json().age;
    let homeTown = ctx.req.json().homeTown;
  
    // Create the new profile
    await profiles.doc(id).set({ name, age, homeTown });
  
    // Return the id
    ctx.res.json({
      msg: `Profile with id ${id} created.`,
    });
  });

  profileApi.get('/profiles/:id', async (ctx) => {
    const { id } = ctx.req.params;
  
    // Return the profile
    try {
      const profile = await profiles.doc(id).get();
      return ctx.res.json(profile);
    } catch (error) {
      ctx.res.status = 404;
      ctx.res.json({
        msg: `Profile with id ${id} not found.`,
      });
    }
  });

  profileApi.get('/profiles', async (ctx) => {
    // Return all profiles
    ctx.res.json({
      output: await profiles.query().fetch(),
    });
  });

  profileApi.delete('/profiles/:id', async (ctx) => {
    const { id } = ctx.req.params;
  
    // Delete the profile
    try {
      profiles.doc(id).delete();
    } catch (error) {
      ctx.res.status = 404;
      ctx.res.json({
        msg: `Profile with id ${id} not found.`,
      });
    }
  });

  profileApi.put('/profiles/:id', async (ctx) => {
    const { id } = ctx.req.params;
    const doc = profiles.doc(id);
  
    try {
      // Update values provided
      const current = await doc.get();
      let name = ctx.req.json().name ?? current['name'] ?? '';
      let age = ctx.req.json().age ?? current['age'] ?? '';
      let homeTown = ctx.req.json().homeTown ?? current['homeTown'] ?? '';
  
      // Create or Update the profile
      await doc.set({ name, age, homeTown });
    } catch (error) {
      ctx.res.status = 404;
      ctx.res.json({
        msg: `Profile with id ${id} not found.`,
      });
    }
  });