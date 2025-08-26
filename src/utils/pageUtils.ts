export type ParentMenuName =
  | "매물"
  | "고객"
  | "계약"
  | "일정"
  | "상담"
  | "문자";

interface SubmenuItem {
  name: string;
  to: string;
}

interface MenuItem {
  name: ParentMenuName;
  key: string;
  to?: string;
  submenu?: SubmenuItem[];
}

export const MENU_INFO: MenuItem[] = [
  {
    name: "매물",
    key: "properties",
    submenu: [
      { name: "개인 매물", to: "/properties/agent" },
      { name: "공개 매물", to: "/properties/public" },
    ],
  },
  { name: "고객", key: "customers", to: "/customers" },
  { name: "계약", key: "contracts", to: "/contracts" },
  { name: "일정", key: "schedules", to: "/schedules" },
  {
    name: "상담",
    key: "counsels",
    submenu: [
      { name: "일반 상담", to: "/counsels/general" },
      { name: "사전 상담", to: "/counsels/pre" },
    ],
  },
  {
    name: "문자",
    key: "messages",
    submenu: [
      { name: "단체 문자 발송", to: "/messages/bulk" },
      { name: "문자 발송 내역", to: "/messages/history" },
    ],
  },
];

export interface BreadcrumbItem {
  name: string;
  path: string;
  isActive: boolean;
}

export const getPageBreadcrumb = (pathname: string): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/", isActive: false },
  ];

  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return breadcrumbs;
  }

  if (pathname.startsWith("/my")) {
    breadcrumbs.push({
      name: "마이페이지",
      path: "/my",
      isActive: !pathname.includes("/edit-survey"),
    });
    if (pathname.includes("/edit-survey")) {
      breadcrumbs.push({
        name: "설문 수정",
        path: "/my/edit-survey",
        isActive: true,
      });
    }
    return breadcrumbs;
  }

  for (const menu of MENU_INFO) {
    if (menu.submenu) {
      for (const submenu of menu.submenu) {
        if (pathname.startsWith(submenu.to)) {
          breadcrumbs.push({
            name: menu.name,
            path: submenu.to,
            isActive: false,
          });
          breadcrumbs.push({
            name: submenu.name,
            path: submenu.to,
            isActive: pathname === submenu.to,
          });

          if (pathname !== submenu.to && pathname.includes("/")) {
            breadcrumbs.push({ name: "상세", path: pathname, isActive: true });
          }
          return breadcrumbs;
        }
      }
    } else if (menu.to && pathname.startsWith(menu.to)) {
      breadcrumbs.push({
        name: menu.name,
        path: menu.to,
        isActive: pathname === menu.to,
      });

      if (pathname !== menu.to && pathname.includes("/")) {
        breadcrumbs.push({ name: "상세", path: pathname, isActive: true });
      }
      return breadcrumbs;
    }
  }

  breadcrumbs.push({ name: "페이지", path: pathname, isActive: true });
  return breadcrumbs;
};

export const getPageTitle = (pathname: string): string => {
  const breadcrumbs = getPageBreadcrumb(pathname);
  return breadcrumbs.map((item) => item.name).join(" > ");
};
