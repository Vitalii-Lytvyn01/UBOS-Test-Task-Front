const basePath = "https://nodered-1340-6649d14d40bae411000000ce.ubos.tech";

export const api = {
  get: (endpoint: string) => fetch(`${basePath}/${endpoint}`),
  post: (endpoint: string, body: object) =>
    fetch(`${basePath}/${endpoint}`, {
      method: "POST",
      body: body && JSON.stringify(body),
    }),
  put: (endpoint: string, body: object) => fetch(`${basePath}/${endpoint}`, {
    method: "PUT",
    body: body && JSON.stringify(body),
  }),
  delete: (endpoint: string, body: object) => fetch(`${basePath}/${endpoint}`, {
    method: "DELETE",
    body: body && JSON.stringify(body),
  }),
}