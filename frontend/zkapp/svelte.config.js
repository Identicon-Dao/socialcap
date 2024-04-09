import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(
      {
  			// default options are shown
  			out: 'build',
  			precompress: true,
  			envPrefix: '',
  			polyfill: true
  		}      
    //   {
    //   // default options are shown. On some platforms
    //   // these options are set automatically — see below
    //   pages: 'build',
    //   assets: 'build',
    //   // fallback: undefined, // for static site
    //   fallback: 'index.html', // for SPA
    //   precompress: false,
    //   strict: true
    // }
    ),

    prerender: {
      entries: [
        '*',
        '/credential/claimed/[uid]',
        '/credential/issued/[uid]',
        '/credential/edit/[uid]',
        '/admined/[uid]',        
        '/admined/new',        
        '/admined/master-plan/[uid]',   
        '/community/[uid]',
        '/task/[uid]',
        '/otp/[session]',
        '/profile'     
      ]
    },

    alias: {
      '@components': path.resolve('./src/lib/components'),
      '@models': path.resolve('./src/lib/models'),
      '@apis': path.resolve('./src/lib/apis'),
      '@utilities': path.resolve('./src/lib/utilities'),
    },
  }
};

export default config;