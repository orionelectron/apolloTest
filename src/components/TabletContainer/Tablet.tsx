import React from "react";
import styles from './tablet.module.css';
import Navbar from "../Navbar/Navbar";
import airforce1 from './airforce_1.png';
import airforce from './air_force.png';

function Tablet() {
    return (
        <>
            <div className={styles.tablet_container}>
                <Navbar />
                <div className={styles.product_details}>
                    <div className={styles.breadcrumbs}> Home / Product Details </div>
                    <div className={styles.banner}> Product Details </div>
                    <div className={styles.prev_next}>
                        <span> Prev </span>
                        <span> Next </span>
                    </div>
                    <div className={styles.dashboard_container}>
                        <div className={styles.description}>
                            <div className={styles.text_description}>
                                Nike Air Max 270 to Chuck Taylors
                            </div>
                            <div className={styles.text_title}>
                                Nike's Air Force 1s were among the most popular sneakers this year
                            </div>
                            <div className={styles.prod_images}>
                                <span className={styles.prod_image}> <img src={airforce1} /></span>
                                <span className={styles.prod_image}> <img src={airforce1} /></span>
                                <span className={styles.prod_image}>  <img src={airforce1} /></span>
                            </div>
                        </div>
                        <div className={styles.product}>
                            <div className={styles.prod_image_container}>
                                <img src={airforce} />
                            </div>
                        </div>
                        <div className={styles.product_attributes}>
                            <div className={styles.product_attribute}>
                                <span>Review: </span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                            </div>
                            <div className={styles.product_attribute}> </div>
                            <div className={styles.product_attribute}> </div>
                            <div className={styles.product_attribute}> </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Tablet;