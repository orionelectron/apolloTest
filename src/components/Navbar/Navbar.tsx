import React from 'react';
import styles from "./navbar.module.css";
import logo from './assets/shop_logo.png';
import cartLock from './assets/cart_lock.png';


function Navbar(props: Props) {
    return (
        <div className={styles.links_container}>
            <div className={styles.shirt_button}>
                <div id={styles.first_dot}> </div>
                <div id={styles.second_dot}> </div>
                <div id={styles.third_dot}> </div>
                <div id={styles.fourth_dot}> </div>
            </div>
            <div className={styles.company_logo}>
                <img src={logo} />
            </div>
            <div className={styles.route_links}>
                <div> Home </div>
                <div> Shop </div>
                <div> Blog </div>
                <div> Contact</div>
            </div>

            <div id={styles.total_cost}> $230.00 </div>
            <div id={styles.cart_indicator}> <img src={cartLock} /> <div> 2 </div> </div>


        </div>
    )
}

export default Navbar;