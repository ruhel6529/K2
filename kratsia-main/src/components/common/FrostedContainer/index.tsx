import React from 'react';
import styles from './index.module.css';
import classNames from "classnames";

const FrostedContainer = ({children, className, style}) => {
    const containerClasses = classNames(styles.container, className);
    return <div className={containerClasses} style={style}>{children}</div>;
};
export default FrostedContainer;
