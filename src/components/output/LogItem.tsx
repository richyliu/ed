import React, { useState } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import arta from 'react-syntax-highlighter/dist/styles/hljs/arta';

interface LogItemProps {
  data: any;
}

const LogItem: React.FunctionComponent<LogItemProps> = ({ data }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <SyntaxHighlighter
      language="json"
      style={arta}
      onClick={() => setCollapsed(!collapsed)}
    >
      {JSON.stringify(data, null, collapsed ? '' : 2)}
    </SyntaxHighlighter>
  );
};

export default LogItem;
