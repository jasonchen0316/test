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
    isNaN(parseInt(arrData[0])) ||
    isNaN(parseInt(arrData[1])) ||
    !(typeof arrData[2] === 'string' && arrData[2] === "'Temperature'" && arrData[2].startsWith("'") && arrData[2].endsWith("'")) ||
    isNaN(parseFloat(arrData[3])) ||
    !(parseFloat(arrData[3]) % 1 !== 0)
  ) {
    tempData.push(arrData);
    return res.status(400).json({status: 400, message: "Bad Request"});
  }
  if (parseFloat(arrData[3]) > 90) {
     res.send({ overtemp: 'false' });
  } else {
    const timedate = new Date(arrData[1] * 1000);
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
      ('0' + timedate.getUTCSeconds()).slice(-2) +
      '.' +
      (timedate.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
    const body = {
      overtemp: true,
      device_id: arrData[0],
      formatted_time: fixedTime,
    }
    res.send(body);
  }
  
});

app.get('/error', (req, res) =>{
  const formattedData = {errors: tempData}
  res.send(formattedData)
});

app.delete('/error', (req,res) =>{
  tempData = [];
  res.send("Buffer has been deleted")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
