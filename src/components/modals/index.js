import Add from './Add.jsx';
import Remove from './Remove.jsx';

const modals = {
  adding: Add,
  removing: Remove,
};

export default (modalName) => modals[modalName];
