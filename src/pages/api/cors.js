import request from "request";

export default (req, res) => {
  const url = req.body.url;
  console.log(req.body);
  console.log(`CORS Proxy GET ${url}`);
  request(url).pipe(res);
}
