import { app } from 'mu';
app.get('/book-reports', function( req, res ) {
  res.send( { message: `Welcome to book-reports` } );
});
