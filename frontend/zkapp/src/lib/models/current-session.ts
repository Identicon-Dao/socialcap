
export { getCurrentSession, setActiveSession } ;

const CURRENT_SESSION = "current-session";

function getCurrentSession() {
  let data = localStorage.getItem(CURRENT_SESSION);
  // we simulate it for now ...
  data = mockup;
  
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

const mockup = JSON.stringify({
  protocol: "http",
  host: "localhost",
  port: 3080,
  authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlYzNjNmUyNTRkMGI0MmRlYmQ5MzlkOWE3YmQ3Y2FjYyIsInNlc3Npb25fa2V5IjoiOTcyNDliYzBjYWE5NDE3OThkZDI5YWM2MDU1OGFmZGYiLCJjcmVhdGVkX3V0YyI6IjIwMjMtMDctMzBUMTM6NTI6MDMuNjc5WiIsImV4cGlyZXNfdXRjIjpudWxsLCJpYXQiOjE2OTA3MjUxMjN9.zqZ7e9P3SAfxTARKzKO-7U9Ryj8o9JaAJdX54qejJTc"
});
