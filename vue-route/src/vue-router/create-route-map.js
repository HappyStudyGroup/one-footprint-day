/**
 * 一个参数是初始化,两个参数就是动态添加路由
 * @param {*} routes 
 * @param {*} oldPathMap 
 */
export default function createRouteMap(routes, oldPathMap) {
  let pathMap = oldPathMap || {};
  routes.forEach(route => {
    addRouteRecord(route, pathMap, null)
  })
  return {
    pathMap
  }
}

function addRouteRecord(route, pathMap, parent) { // pathMap = { '路径': 记录 }
  // 要判断儿子的路径不是以/开头,否则不拼接父路径
  let path = parent && route.path.split('')[0] !== '/' ? `${parent.path}/${route.path}` :route.path
  let record = {
    path: route.path,
    parent, // 指代的就是父记录
    component: route.component,
    name: route.name,
    props: route.name,
    params: route.params || {},
    meta: route.meta,
  }
  if(!pathMap[path]) {
    pathMap[path] = record
  }
  if(route.children) { // 递归, 直到没有children
    route.children.forEach(childRoute => {
      addRouteRecord(childRoute, pathMap, record)
    })
  }
}