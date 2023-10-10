import request from "request";

export default function cors(req, res) {
  const url = req.body.url;
  console.log(req.body.url);
  console.log(`CORS Proxy GET ${url}`);
  request(url).pipe(res);
}
