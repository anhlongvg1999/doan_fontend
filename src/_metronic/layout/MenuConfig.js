export default {
  header: {
    self: {},
    items: [],
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "dashboard",
        translate: "MENU.DASHBOARD",
        permission: "get-dashboard",
        bullet: "dot",
      },
      {
        title: "Quản lí User",
        root: true,
        icon: "flaticon-avatar",
        bullet: "dot",
        submenu: [
          {
            title: "User List",
            page: "User/List",
          },
          {
            title: "Add New User",
            page: "User/AddNew",
          },
        ]
      }, 
         
      {
        title: "Role",
        root: true, 
        icon: "flaticon-cogwheel-2", 
        bullet: "dot", 
        submenu: [
          {
            title: "Role list",
            page: "Role/List",
          }
        ]
      },
      
    ],
  },
};
