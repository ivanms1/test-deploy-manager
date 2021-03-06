import React from "react";

import Button from "../../../components/Button";

import useDbUser from "../../../hooks/useDbUser";

import Arrow from "../../../assets/icons/arrow.svg";

import { StepProps } from "..";

import styles from "./Welcome.module.scss";

const { api } = window;

function Welcome({ setCurrentStep }: StepProps) {
  const { user } = useDbUser();

  return (
    <>
      <div className={styles.UserBox}>
        <img
          src={user?.picture}
          className={styles.ProfilePicture}
          alt="profile-picture"
        />
        <div className={styles.InfoBox}>
          <span className={styles.Name}>{user?.name}</span>
          <span className={styles.Email}>{user?.email}</span>
        </div>
      </div>
      <div>
        <div className={styles.Title}>Hello, {user?.givenName}!</div>
      </div>
      <div className={styles.Subtitle}>
        You will be guided through our CONUN wallet creation screens with an
        option in to import an existing Ethereum wallet. Please download the QR
        code and Wallet ID at the end of this process. Since, we do not store
        your private account information, you will need your wallet ID when
        logging back in.
      </div>
      <div className={styles.NextButtonContainer}>
        <span className={styles.Text}>Next</span>
        <Button
          type="button"
          onClick={() => setCurrentStep("intro")}
          className={styles.ArrowButton}
          noStyle
        >
          <Arrow className={styles.Arrow} />
        </Button>
      </div>
      <Button
        type="button"
        onClick={() => api.logout()}
        noStyle
        className={styles.LogoutButton}
      >
        <span>Not you?</span> Login with a different account.
      </Button>
    </>
  );
}

export default Welcome;
