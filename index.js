import express from "express";
import bodyParser from "body-parser";



import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline';

const portA = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
  stopBits: 1,
  parity: 'none',
});

const parser = portA.pipe(new ReadlineParser({ delimiter: '\n' }));

// Read the port data
portA.on("open", () => {
  console.log('serial port open');
});

parser.on('data', data =>{
  console.log('got word from arduino:', data);
});




const app = express();
const port = 3000;
const mypassword = "emz";
var userIsAuthorised = false;

var aname = [];
var bname = [];
var tname = [];
var count = 0;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


function passwordCheck(req, res, next) {
  const password = req.body["password"];
  if (password === "emz") {
    userIsAuthorised = true;
  }
  next();
  }

app.use(passwordCheck);

app.get("/", (req,res) => {
    
    SerialPort.list().then(ports => {
      ports.forEach(function(port) {
          console.log(port.path)
      })
  })
  console.log("hello");
  res.render("index.ejs");
  
  })

// Function to send "right" command to Arduino
function sendRightCommand() {
  portA.write('right\n', (err) => {
    if (err) {
      console.error('Error writing to serial port:', err);
    } else {
      console.log('Sent "right" command to Arduino');
    }
  });
}

// Function to send "left" command to Arduino
function sendLeftCommand() {
  portA.write('left\n', (err) => {
    if (err) {
      console.error('Error writing to serial port:', err);
    } else {
      console.log('Sent "left" command to Arduino');
    }
  });
}  

app.post('/turnright', (req, res) => {
  // Send "right" command to Arduino
  sendRightCommand();
  res.status(200).redirect('/control');
});

app.post('/turnleft', (req, res) => {
  // Send "left" command to Arduino
  sendLeftCommand();
  res.status(200).redirect('/control');
});



app.get("/test", (req,res) => {
  // res.render("bloglist.ejs");
  res.render("test.ejs", {namea: aname, nameb: bname});
})
   
app.get("/about", (req,res) => {
    res.render("about.ejs");
})

app.get("/control", (req,res) => {
  res.render("control.ejs");
})




app.get("/contact", (req,res) => {
    res.render("contact.ejs");
})


app.post("/control", (req, res) => {
  if (userIsAuthorised) {
      res.render("control.ejs");
      } else {
      res.redirect("/");
      }

});  












app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

    
