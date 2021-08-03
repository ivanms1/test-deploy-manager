import classNames from "classnames";
import React from "react";

import GoogleLogo from "../../../assets/icons/google.svg";
import KakaoLogo from "../../../assets/icons/kakao.svg";
import ConunLogo from "../../../assets/icons/conun-logo-big.svg";

import styles from "./SocialLogin.module.scss";

const { api } = window;

function SocialLogin() {
  return (
    <div className={styles.SocialLogin}>
      <ConunLogo className={styles.ConunLogo} />
      <div className={styles.ButtonsContainer}>
        <button
          className={classNames(styles.Button, styles.google)}
          type="button"
          onClick={() => api.openAuthWindow("google")}
        >
          <GoogleLogo className={styles.Icon} />
          Sign in with Google
        </button>
        <button
          className={classNames(styles.Button, styles.kakao)}
          type="button"
          onClick={() => api.openAuthWindow("kakao")}
        >
          <KakaoLogo className={styles.Icon} />
          Sign in with Kakao
        </button>
      </div>
    </div>
  );
}

export default SocialLogin;
