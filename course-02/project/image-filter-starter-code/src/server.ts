import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  /**************************************************************************** */
  app.get( "/filteredimage/", async (req:express.Request, res:express.Response)  => {
    let {image_url} = req.query;
    //    1. validate the image_url query
    if (!image_url){
      return res.status(400).send('Error : The image URL is required.');
    }
    
    //    2. call filterImageFromURL(image_url) to filter the image
    await filterImageFromURL(image_url).then( function (filteredpath){

    //    3. send the resulting file in the response
      return res.sendFile(filteredpath, error => {
        if (!error){
    
    //    4. deletes any files on the server on finish of the response
          deleteLocalFiles([filteredpath]);
        }
      });
    }).catch(function(err){
      return res.status(400).send('Some thing went wrong! ' + err);
    });
    
  });

  //! END 
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();