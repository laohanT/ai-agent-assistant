import { ReactNode } from "react";

// 定义路由项接口
interface RouteItem {
  path?: string;
  index?: boolean;
  children?: RouteItem[];
  handle?: {
    name?: string;
    icon?: string;
  };
}

// 处理后的路由接口
interface ProcessedRoute {
  path: string;
  name: string;
  icon?: string;
}

// 获取sessionId
const createSessionId = () => {
  return window.crypto.randomUUID();
};

// 获取 SessionIds（会话历史id）
export const getOrCreateSessionIds = () => {
  const sessionId = createSessionId();
  // 先取出
  const IdsStr: string | null = window.sessionStorage.getItem("sessionIds");

  let ids: string[] = [];

  if (IdsStr && Array.isArray(JSON.parse(IdsStr))) {
    // 存在"[]"
    ids = JSON.parse(IdsStr);
    ids.push(sessionId);
    if (ids.length > 20) {
      // 只存20条会话历史
      ids.shift();
    }
  } else {
    // 证明没有sessionIds，是初始化
    ids = [sessionId];
  }
  window.sessionStorage.setItem("sessionIds", JSON.stringify(ids));
  return ids;
};

// 处理路由表
export const handleRoutes = (routes: RouteItem[]): ProcessedRoute[] => {
  const result: ProcessedRoute[] = [];

  const processRoute = (route: RouteItem, parentPath: string = "") => {
    let currentPath = parentPath;

    if (route.index) {
      // index 路由使用父路径
      currentPath = parentPath;
    } else if (route.path) {
      if (parentPath == "/") {
        currentPath = route.path;
      } else {
        // 拼接路径
        currentPath = parentPath ? `${parentPath}/${route.path}` : route.path;
      }
    }

    // 如果有 handle.name，则加入结果
    if (route.handle?.name) {
      result.push({
        path: currentPath,
        name: route.handle.name,
        icon: route.handle.icon,
      });
    }

    // 递归处理子路由
    if (route.children) {
      route.children.forEach((child) => processRoute(child, currentPath));
    }
  };

  routes.forEach((route) => processRoute(route));
  return result;
};
