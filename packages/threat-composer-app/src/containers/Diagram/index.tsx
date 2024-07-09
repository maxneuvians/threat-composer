import { DiagramComponent } from '@aws/threat-composer';
import {
  ROUTE_THREAT_LIST,
} from '../../config/routes';
import useNavigateView from '../../hooks/useNavigationView';

const Diagram = () => {
  const handleNavigationView = useNavigateView();
  return <DiagramComponent
    appMode={process.env.REACT_APP_APP_MODE || undefined}
    onThreatListView={() => handleNavigationView(ROUTE_THREAT_LIST)}
  />;
};

export default Diagram;