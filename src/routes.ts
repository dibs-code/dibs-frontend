export enum RoutePath {
  HOME = '/',
}

export function getRoute(path: RoutePath, params?: { [key: string]: string }) {
  let res: string = path;
  if (params) {
    for (const key in params) {
      res = res.replace(`:${key}`, params[key]);
    }
  }
  return res;
}

export default RoutePath;
