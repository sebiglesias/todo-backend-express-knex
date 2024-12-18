const app = require('./server-config.js');
const routes = require('./server-routes.js');
const userRoutes = require('./user-routes.js');

const port = process.env.PORT || 5000;

app.get('/users', userRoutes.getAllUsers); //
app.get('/users/:id', userRoutes.getUser); //

app.post('/users', userRoutes.postUser); //
app.patch('/users/:id', userRoutes.patchUser); //

app.delete('/users', userRoutes.deleteAllUsers); //
app.delete('/users/:id', userRoutes.deleteUser); //


app.get('/', routes.getAllTodos);
app.get('/:id', routes.getTodo);

app.post('/', routes.postTodo); //
app.patch('/:id', routes.patchTodo); //

app.delete('/', routes.deleteAllTodos);
app.delete('/:id', routes.deleteTodo);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;