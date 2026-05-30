function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
console.log(parseJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsIm5hbWUiOiJBZG1pbiIsInR5cGUiOjEsInJvbGVfaWQiOjEsImlhdCI6MTc3OTc0NTMxOCwiZXhwIjoxNzc5ODMxNzE4fQ.yUmH9r2AtkEAyLA4xOU59dZVxRz0X_mzvgIR2g4NPTc'));
