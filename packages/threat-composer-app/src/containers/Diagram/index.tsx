import { DiagramComponent } from '@aws/threat-composer';
import {
  ROUTE_THREAT_LIST,
} from '../../config/routes';
import useNavigateView from '../../hooks/useNavigationView';

const Diagram = () => {
  const handleNavigationView = useNavigateView();
  return <DiagramComponent onThreatListView={() => handleNavigationView(ROUTE_THREAT_LIST)}/>;
};

export default Diagram;