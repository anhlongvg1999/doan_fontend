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
            title: "Danh sách người dùng",
            page: "User/List",
          },
          {
            title: "Thêm mới người dùng",
            page: "User/AddNew",
          },
        ]
      },
      {
        title: "Nhà sản xuất sản phẩm",
        root: true,
        icon: "flaticon-network",
        bullet: "dot",
        submenu: [
          {
            title: "Danh sách nhà sản xuất",
            page: "ProductManufacturer/ProductManufacturerList",
          },
        ]
      }, 
      {
        title: "Quản lý sản phẩm",
        root: true,
        icon: "flaticon-avatar",
        bullet: "dot",
        submenu: [
          {
            title: "Quản lý size",
            page: "Product/SizeList",
          },
          {
            title: "Danh sách sản phẩm",
            page: "Product/ProductList",
          },
        ]
      },
      {
        title: "Quản lý đơn hàng",
        root: true,
        icon: "flaticon-avatar",
        bullet: "dot",
        submenu: [
          {
            title: "Quản lí nhà vận chuyển",
            page: "Product/SizeList",
          },
          {
            title: "Quản lí đơn hàng",
            page: "Product/ProductList",
          },
        ]
      }, 
    ],
  },
};
