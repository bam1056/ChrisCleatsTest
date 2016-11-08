const express      = require('express');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const Contact      = require('./app/models/contact');
const app          = express();
const port         = process.env.PORT || 8080;
const cors         = require('cors');
const mongo_url    = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleatsapi/'
mongoose.Promise   = global.Promise;

mongoose.connect(mongo_url, (err, database) => {
  if(err){
    console.log(err);
    process.exit(1);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));

const router = express.Router();

router.route('/contact')

.post((req, res) => {

    var contact = new Contact();
    contact.name = req.body.name;
    contact.phone = req.body.phone;
    contact.email = req.body.email;
    contact.message = req.body.message;

    contact.save((err) => {
        if (err)
            res.send(err);

        res.json({ message: 'Contact created!' });
    });
})
.get((req, res) => {
       Contact.find((err, contact) => {
           if (err)
               res.send(err);

           res.json(contact);
       });
   });

router.route('/contact/:contactinfo_id')

  .delete((req, res) => {
  Contact.remove({
     _id: req.params.contactinfo_id
  }, (err, contact) => {
     if (err)
         res.send(err);

     res.json({ message: 'Successfully deleted' });
  });
});

app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);
