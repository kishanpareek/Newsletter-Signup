const express = require("express");

const bodyParser = require("body-parser");

const  requestModule = require("request");

const app = express();



const https = require("https");

 require('dotenv').config();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening on port 3000");
});

app.get("/", function(req, res){
  res.sendFile(__dirname +"/signup.html");
});

// c21d63a09047315a56bde13b3cf3f723-us13->API Key
 // 28102cdfbc->List ID
app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }

      }
    ]
  };

  var jsonData = JSON.stringify(data);
  const url = "https://us13.api.mailchimp.com/3.0/lists/28102cdfbc";
  const apikey = process.env.MAILCHIMP_API_KEY;
  const options = {
    method: "POST",
    auth: "kishan:apikey"
  }
  const request = https.request(url, options, function(response) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        res.sendFile(__dirname + "/success.html");
          response.on("data", function(data) {
              console.log(JSON.parse(data));
          });
      } else {
        res.sendFile(__dirname +"/failure.html")
          console.log(`statusCode: ${response.statusCode}`);
          console.log(`statusMessage: ${response.statusMessage}`);
      }
  });

  request.on('error', function(error) {
      console.log(error);
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})
