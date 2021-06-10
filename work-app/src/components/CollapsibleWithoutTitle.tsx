import { ReactNode, useEffect, useState } from "react";
import { Icon } from "reflexjs";

export interface CollapsibleWithoutTitleProps {
  isCollapsed?: boolean;
  children: ReactNode;
}

const CollapsibleWithoutTitle = ({
  isCollapsed = false,
  children,
}: CollapsibleWithoutTitleProps) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  return (
    <div
      display="flex"
      flexDirection="column"
      backgroundColor="#141923"
      rounded="3"
      m="2"
    >
      <div p="2" className={collapsed ? "expanded" : "collapsed"}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleWithoutTitle;
