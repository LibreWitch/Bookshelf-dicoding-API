const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
<<<<<<< HEAD
    port: 5000,
    host: 'localhost',
=======
    port: 3000,
>>>>>>> 0533736848785d0ec7cdec4fcf7345c745d2a159
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
 // console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
