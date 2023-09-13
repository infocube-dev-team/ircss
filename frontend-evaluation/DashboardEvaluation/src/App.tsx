import './App.less';
import DBApp from './components/DBApp';
import { withTranslation } from 'react-i18next';

function App() {
  const WrappedDBApp = withTranslation()(DBApp);
  return (
    <WrappedDBApp />
  );
}

export default App;

