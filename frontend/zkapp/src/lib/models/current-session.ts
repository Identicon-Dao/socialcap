
export { 
  getCurrentSession, 
  setActiveSession, 
  removeActiveSession 
} ;

const CURRENT_SESSION = "current-session";

function getCurrentSession() {
  let data = localStorage.getItem(CURRENT_SESSION);
  // we simulate it for now ...
  // data = mockup;
  return data && JSON.parse(data) || null;
};

function setActiveSession(params: {
  host: string,
  port: number,
  authorization: string,
  protocol?: string  
}) {
  params.protocol = params.protocol || "https";
  localStorage.setItem(CURRENT_SESSION, JSON.stringify(params));
  return params;
};

function removeActiveSession() {
  localStorage.removeItem(CURRENT_SESSION);
  return;
};


/*
mazito.v2+04@gmail.com
const mockup = JSON.stringify({
  protocol: "http",
  host: "localhost",
  port: 3080,
  authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlYzNjNmUyNTRkMGI0MmRlYmQ5MzlkOWE3YmQ3MDAxMyIsInNlc3Npb25fa2V5IjoiNjE3NTZmZTE5OTU0NDhhNWE1OGIzN2ZjNWNlMGViYTYiLCJjcmVhdGVkX3V0YyI6IjIwMjMtMDctMzFUMjA6MjE6MDAuNDYzWiIsImV4cGlyZXNfdXRjIjpudWxsLCJpYXQiOjE2OTA4MzQ4NjB9.bqUVr6Rv_EXX2ez76XdBNjiAbDv3q6UDH7KvDRDq7wA"
});
*/

// leomanzanal@gmail.com
const mockup = JSON.stringify({
  protocol: "http",
  host: "localhost",
  port: 3080,
  authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlYzNjNmUyNS00ZDBiLTQyZGUtYmQ5My05ZDlhN2JkN2NhY2MiLCJzZXNzaW9uX2tleSI6IjIyZjM2YmM2ZTQ2ZjQ0Yjc5MDIxMzU5MTk5MjAxYjIwIiwiY3JlYXRlZF91dGMiOiIyMDIzLTA3LTE0VDIzOjE3OjAxLjI1MVoiLCJleHBpcmVzX3V0YyI6bnVsbCwiaWF0IjoxNjg5Mzc2NjIxfQ.c49U-aGtkakR98nuC56mV6NCwwd6-5EFtgwn-Ld4EWA"
});
/*
*/