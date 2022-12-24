import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
 
export const actions: Actions = {
  createNewRoom: async () => {
      const roomNumber = (Math.random() * 10000).toFixed(0);
      // return {
      //   headers: { Location: `/room/${roomNumber}` },
      //   status: 303
      // }
			throw redirect(303, `/room/${roomNumber}`);
  },
};