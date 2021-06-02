import { ReactNode, useEffect, useState } from "react";
import { Icon } from "reflexjs";

export interface CollapsibleProps {
  title: string;
  isCollapsed?: boolean;
  children: ReactNode;
}

const Collapsible = ({
  title,
  isCollapsed = false,
  children,
}: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const handleHeadingClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      display="flex"
      flexDirection="column"
      p="2"
      backgroundColor="#141923"
      rounded="3"
      m="2"
    >
      <div
        onClick={handleHeadingClick}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <h3>{title}</h3>
        {collapsed ? (
          <Icon name="chevronUp" size="34" />
        ) : (
          <Icon name="chevronDown" size="34" />
        )}
      </div>
      <div className={collapsed ? "expanded" : "collapsed"}>{children}</div>
    </div>
  );
};

export default Collapsible;
