import { Tab } from 'src/models/tab';
import Editor from 'src/components/editor/Editor';
import Output from 'src/components/output/Output';

const tabs: Tab[] = [
  {
    name: 'E',
    component: Editor,
  },
  {
    name: 'O',
    component: Output,
  },
];

export default tabs;