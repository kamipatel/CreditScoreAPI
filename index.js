var express = require("express");
const jsforce = require("jsforce");

var app = express();

const PORT = process.env.PORT || 5000;
const ORGUSERNAME = process.env.orgusername;
const ORGPASSWORD = process.env.orgpassword;
const ORLURL = process.env.orgurl;

app.get("/", function(req, res) {
  res.send("CreditCheck App");
});

app.get("/CreditScore", async (req, res) => {
  const conn = await logintoOrgAndSendEvents();

  res.send({
    status: true,
    message: "Credit score check complete!"
  });

  console.log("Credit status complete!");
}); //CreditScore() end

app.listen(PORT);

async function logintoOrgAndSendEvents() {
  console.log("logintoOrgAndSendEvents called");

  var username = ORGUSERNAME;
  //var password = 'RMe]w%0c67';
  var password = ORGPASSWORD;

  var conn = new jsforce.Connection({
    loginUrl: ORLURL
  });

  await conn.login(username, password);
  await sleep(8000);
  await SendStatusEvent(conn, "MayBeExperianNot");
  await sleep(2000);
  await SendStatusEvent(conn, "MayBeEquifaxNot");
  await sleep(2000);
  await SendStatusEvent(conn, "MayBeTransUnion");
  await sleep(3000);

  console.log("logintoOrg Complete");

  return conn;
}

async function SendStatusEvent(conn, msg) {
  console.log("SendStatusEvent called!");
  await conn.sobject("CreditStatus__e").create(
    {
      message__c: msg
    },
    function(err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      console.log("SendStatusEvent complete");
    }
  );
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
