import express, { json } from 'express';
const app = express();
const port = 3000;

app.use(json())
let tempData = [];
app.post('/temp', (req, res) => {
  const requestBody = req.body;
  const arrData = requestBody.data.split(':');
  if (
    arrData.length !== 4 ||
    isNaN(Number(arrData[0])) || arrData[0].includes(".")||
    isNaN(Number(arrData[1])) || arrData[1].includes(".")||
    arrData[2] !== "'Temperature'" || !(arrData[2].startsWith("'")) && !(arrData[2].endsWith("'")) ||
    isNaN(Number(arrData[3])) ||
    !(arrData[3].includes("."))
  ) {
    tempData.push(requestBody.data);
    return res.status(400).json({"error": "Bad Request"});
  }
  if (parseFloat(arrData[3]) <= 90) {
     res.send({ overtemp: 'false' });
  } else {
    const timedate = new Date(parseInt(arrData[1]));
    const fixedTime =
      timedate.getUTCFullYear() +
      '-' +
      ('0' + timedate.getUTCMonth()).slice(-2) +
      '-' +
      ('0' + timedate.getUTCDate()).slice(-2) +
      ' ' +
      ('0' + timedate.getUTCHours()).slice(-2) +
      ':' +
      ('0' + timedate.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + timedate.getUTCSeconds()).slice(-2) 
    const body = {
      overtemp: true,
      device_id: arrData[0],
      formatted_time: fixedTime,
    }
    res.send(body);
  }
  
});

app.get('/errors', (req, res) =>{
  const formattedData = {errors: tempData}
  res.send(formattedData)
});

app.delete('/errors', (req,res) =>{
  tempData = [];
  res.send("Buffer has been deleted")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
