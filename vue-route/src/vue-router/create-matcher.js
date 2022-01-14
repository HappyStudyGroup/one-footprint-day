import createRouteMap from "./create-route-map";
import { createRoute } from "./history/base";

export function createMatcher(routes) {
  let { pathMap } = createRouteMap(routes); // 根据用户的配置创建映射表

  console.log(pathMap);

  function addRoutes(routes) { // 动态添加路由权限
    createRouteMap(routes, pathMap)
  }

  function match(path) { //匹配路由,根据路径匹配路由
    let record = pathMap[path]
    return createRoute(record, {
      path
    })
  }
  return {
    addRoutes,
    match
  }
}