const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  roles: state => state.user.roles,
  superAdmin: state => state.user.superAdmin,
  taxNum: state => state.user.taxNum,
  companyName: state => state.user.companyName,
  registerLocation: state => state.user.registerLocation,
  permission_routes: state => state.permission.routes,
}
export default getters
