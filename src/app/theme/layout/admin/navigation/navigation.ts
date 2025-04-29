export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  // {
  //   id: 'navigation',
  //   title: 'Navigation',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
      
  //   ]
  // },
  {
    id: 'basic',
    title: 'New',
    type: 'collapse',
    icon: 'feather icon-plus-square',
    children: [
      {
        id: 'button',
        title: 'Standard Order',
        type: 'item',
        url: '/standard-order'
      },
      {
        id: 'badges',
        title: 'Service Order',
        type: 'item',
        url: '/service-order'
      },
    ]

},

  {
  id: 'Orders',
  title: 'Orders',
  type: 'item',
  url: '/order',
  icon: 'feather icon-clipboard'
  },
  {
    id: 'User Role',
    title: 'User Role Management',
    type: 'item',
    url: '/userpermission',
    icon: 'feather icon-check-square'
    },
  {
  id: 'account',
  title: 'Account',
  type: 'item',
  url: '/account',
  // url: '/test',
  icon: 'feather icon-user'
  },

  // Orders Management
  {
    id: 'basic',
    title: 'Orders Management',
    type: 'collapse',
    icon: 'feather icon-file-text',
    children: [
      {
        id: 'Orders',
        title: 'Order',
        type: 'item',
        url: '/orders'
      },
      {
        id: 'headerItem',
        title: 'Header Items',
        type: 'item',
        url: '/headerItem'
      },
      
      {
        id: 'Doorspecies',
        title: 'Door Species',
        type: 'item',
        url: '/doorspecies'
      },
      {
        id: 'finishSheen',
        title: 'Finish/Sheen',
        type: 'item',
        url: '/finishsheen'
      },
      {
        id: 'orderStatus',
        title: 'Order Status',
        type: 'item',
        url: '/orderstatus'
      },
      
      
    ]
  
  },

   // Items Management
   {
    id: 'basic',
    title: 'Item Management',
    type: 'collapse',
    icon: 'feather icon-cpu',
    children: [
      {
        id: 'items',
        title: 'Items',
        type: 'item',
        url: '/items'
        // url: '/mobel-item-list'
      },
      {
        id: 'itemMods',
        title: 'Items Mods',
        type: 'item',
        url: '/itemsmods'
      },
      
      {
        id: 'linkMOS',
        title: 'Link MOS - CV Items',
        type: 'item',
        url: '/linkMos'
      },
      {
        id: 'importItems',
        title: 'Import Items',
        type: 'item',
        url: '/importitems'
      },
      {
        id: 'badges',
        title: 'Import Mods',
        type: 'item',
        url: '/importmods'
      },
    ]
  },

   // Dealers Management
   {
    id: 'basic',
    title: 'Dealers Management',
    type: 'collapse',
    icon: 'feather icon-users',
    children: [
      {
        id: 'accounts',
        title: 'Account Management',
        type: 'item',
        // url: '/test',
        url: '/accounts'
        
      },
      {
        id: 'badges',
        title: 'Manage Dealers',
        type: 'item',
        // url: '/test',
        url: '/managedealers'
      },
      
    ]
  },

  // Schedules
  {
    id: 'basic',
    title: 'Schedules',
    type: 'collapse',
    icon: 'feather icon-calendar',
    children: [
      {
        id: 'calendar',
        title: 'Calendar',
        type: 'item',
        url: '/calendar',
        // url: '/test'
      },
      {
        id: 'shedule',
        title: 'Schedules',
        type: 'item',
        url: '/schedules',
        // url: '/test'
      },
      {
        id: 'editSchedule',
        title: 'Edit Schedule',
        type: 'item',
        url: '/editschedule',
        // url: '/test'
      },
      
    ]
  },

  // Dealer Admin
  {
    id: 'dealerAdmin',
    title: 'Dealer Admin',
    type: 'collapse',
    icon: 'feather icon-box',
    children: [
      {
        id: 'dealersReport',
        title: 'Dealers Reports',
        type: 'item',
        url: '/dealerreport'
        // url: '/test'
      },
      {
        id: 'dealersOrder',
        title: 'Dealers Orders',
        type: 'item',
        url: '/dealerorder'
        // url: '/test'
      },
    ]
  },

  // Reports
  {
    id: 'report',
    title: 'Reports',
    type: 'collapse',
    icon: 'feather icon-pie-chart',
    children: [
      {
        id: 'trendReport',
        title: 'Trend Reports',
        type: 'item',
        url: '/trendreport'
        // url: '/test'
      },
      {
        id: 'salesReport',
        title: 'Sales Reports',
        type: 'item',
        url: '/salesreport'
        // url: '/test'
      },
    ]
  },

  // Accounting
  {
    id: 'accounting',
    title: 'Accounting',
    type: 'collapse',
    icon: 'feather icon-file-text',
    children: [
      {
        id: 'button',
        title: 'Invoices',
        type: 'item',
        url: '/invoice'
        // url: '/test'
      }
    ]
  },

    // Setting
    {
      id: 'setting',
      title: 'Setting',
      type: 'collapse',
      icon: 'feather icon-settings',
      children: [
        {
          id: 'button',
          title: 'MOS Settings',
          type: 'item',
          url: '/mossetting'
        }
      ]
    },

  {
    id: 'importorder',
    title: 'Import Order',
    type: 'item',
    url: '/importorder',
    // url: '/test',
    icon: 'feather icon-download'
    },

//   {
//     id: 'basic',
//     title: 'Mobel Only',
//     type: 'collapse',
//     icon: 'feather icon-box',
//     children: [
//       {
//         id: 'button',
//         title: 'Orders',
//         type: 'item',
//         url: '/mobel-order'
//       },
//       {
//         id: 'badges',
//         title: 'Items',
//         type: 'item',
//         // url: '/test'
//         url: '/mobel-item-list'
//       },
//       {
//         id: 'badges',
//         title: 'Items Mods',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Headers',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Door/Species',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Finish/Sheen',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Accounts',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Calendar',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Schedules',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Edit Schedule',
//         type: 'item',
//         url: '/test'
//       },
      
//       {
//         id: 'badges',
//         title: 'Dealers Reports',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Dealers Orders',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Order Status',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Import Items',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Import Mods',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Manage Dealers',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'MOS Settings',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Trend Reports',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Sales Reports',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Invoices',
//         type: 'item',
//         url: '/test'
//       },
//       {
//         id: 'badges',
//         title: 'Import Order',
//         type: 'item',
//         url: '/test'
//       },
      
//     ]

// },
 
  // {
  //   id: 'Authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'signup',
  //       title: 'Sign up',
  //       type: 'item',
  //       url: '/auth/signup',
  //       icon: 'feather icon-at-sign',
  //       target: true,
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'signin',
  //       title: 'Sign in',
  //       type: 'item',
  //       url: '/auth/signin',
  //       icon: 'feather icon-log-in',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },

 
];
