import common from './common.json';
import auth from './features/auth.json';
import dashboard from './features/dashboard.json';
import products from './features/products.json';
import profile from './features/profile.json';
import users from './features/users.json';
import navigation from './navigation.json';

const ruTranslations = {
  ...common,
  ...auth,
  ...dashboard,
  ...products,
  ...profile,
  ...users,
  ...navigation,
};

export default ruTranslations;
