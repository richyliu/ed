import { Tab } from 'src/models/tab';
import Editor from 'src/components/editor/Editor';
import Output from 'src/components/output/Output';
import Settings from 'src/components/settings/Settings';

const tabs: Tab[] = [
  {
    name: 'E',
    component: Editor,
  },
  {
    name: 'O',
    component: Output,
  },
  {
    name: 'S',
    component: Settings,
  },
];

export default tabs;
