import React from "react";
import styles from '@/styles/PageHeader.module.css';

const PageHeaderComponent = (props) => {
    return (
        <div className={styles.pageheader}>
            <div className={styles.textlabel}>DeBabel</div>
            <div className={styles.sessionstatus}>
                <div className={styles.sessiontext}>Service:</div>
                <div className={styles.sessionindicator}>
                    <div className={props.sessionStatus === 'ON' ? styles.sessionon : styles.sessionoff}>{props.sessionStatus}</div>
                </div>
            </div>
        </div>
    )
}

export default PageHeaderComponent;