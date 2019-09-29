export const ModulesList = 
[
  { label: 'Pracownie',
    routerLink: '/admin/lab',
    roles: [ 'sadmin' ],
    children: [
      { label: 'Lista',
        routerLink: '/admin/lab/list' }, 
      { label: 'Nowa pracownia',
        routerLink: '/admin/lab/create'}]
  },
  { label: 'Użytkownicy',
    routerLink: 'admin/user',
    roles: [ 'sadmin', 'admin' ],
    children: [
      { label: 'Lista',
        routerLink: '/admin/user/list'},
      { label: 'Nowy użytkownik',
        routerLink: '/admin/user/create'}]
  },
  {
    label: 'Lekarze',
    routerLink: '/doctorlist',
    roles: [ 'sadmin', 'admin', 'user' ]
  },
  { label: 'Raporty',
    routerLink: '/admin/reports',
    roles: [ 'sadmin', 'admin']
  }
];
